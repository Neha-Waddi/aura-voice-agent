// aiAgent.js (Groq Version - FREE)
// ----------------------------------------

const Groq = require("groq-sdk");
const knowledgeBase = require("./knowledgeBase");
const helpRequest = require("./helpRequest");
const notification = require("./notification");
require("dotenv").config();

class AIAgentService {
  constructor() {
    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    this.model = process.env.AI_MODEL || "llama-3.1-70b-versatile";
    this.confidenceThreshold = 0.7;
    this.conversationHistory = new Map();
  }

  async initialize() {
    try {
      const context = await knowledgeBase.getContextString();
      this.businessContext = context;
      console.log("✅ AI Agent initialized with knowledge base");
    } catch (error) {
      console.error("Error initializing AI agent:", error);
      throw error;
    }
  }

  _getSystemPrompt() {
    return `You are a helpful AI assistant for ${process.env.BUSINESS_NAME}.

BUSINESS INFORMATION:
${this.businessContext}

RULES:
- Answer ONLY using the information above.
- Be friendly, natural, and professional.
- If confidence < 70% OR you're unsure, say:
  "Let me check with my supervisor and get back to you."
- NEVER guess or make up information.
- Keep answers short like a phone conversation.

Always output plain text.`;
  }

  async processMessage(message, sessionId, callerInfo = {}) {
    try {
      // 1️⃣ FIRST: Search knowledge base
      const knowledge = await knowledgeBase.search(message);

      if (knowledge && knowledge.relevanceScore > this.confidenceThreshold) {
        console.log(
          `✅ Found answer in knowledge base (score: ${knowledge.relevanceScore.toFixed(
            2
          )})`
        );
        return {
          answer: knowledge.answer,
          needsHelp: false,
          confidence: knowledge.relevanceScore,
          source: "knowledge_base",
        };
      }

      // 2️⃣ Build conversation history for AI
      const history = this.conversationHistory.get(sessionId) || [];

      const messages = [
        { role: "system", content: this._getSystemPrompt() },
        ...history,
        { role: "user", content: message },
      ];

      // 3️⃣ Generate AI answer from Groq
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: messages,
        temperature: 0.2,
      });

      const response = completion.choices[0].message.content;

      // Save to history
      history.push({ role: "user", content: message });
      history.push({ role: "assistant", content: response });

      this.conversationHistory.set(sessionId, history);

      // 4️⃣ Determine escalation
      const needsHelp = this._shouldEscalate(response, knowledge);

      if (needsHelp) {
        console.log("❓ AI needs help — creating help request");

        const request = await helpRequest.create({
          question: message,
          callerPhone: callerInfo.phone || "unknown",
          callerName: callerInfo.name || "Unknown Caller",
          sessionId,
          context: this._formatContext(history),
          priority: "normal",
        });

        await notification.notifySupervisor(request);
        await helpRequest.incrementNotifications(request.id);

        return {
          answer:
            "Let me check with my supervisor and get back to you shortly. We'll call you back with the information you need.",
          needsHelp: true,
          requestId: request.id,
          confidence: 0,
          source: "escalation",
        };
      }

      // 5️⃣ Normal response
      return {
        answer: response,
        needsHelp: false,
        confidence: knowledge ? knowledge.relevanceScore : 0.5,
        source: "ai_generated",
      };
    } catch (error) {
      console.error("❌ Error processing message:", error);

      return {
        answer:
          "I'm having trouble right now. Let me connect you with my supervisor.",
        needsHelp: true,
        error: error.message,
      };
    }
  }

  _shouldEscalate(response, knowledge) {
    const triggers = [
      "let me check",
      "check with my supervisor",
      "i'm not sure",
      "i don't know",
      "i don't have that information",
    ];

    const lower = response.toLowerCase();
    const containsEscalation = triggers.some((t) => lower.includes(t));

    const lowKBConfidence =
      !knowledge || knowledge.relevanceScore < this.confidenceThreshold;

    return containsEscalation || lowKBConfidence;
  }

  _formatContext(history) {
    return history
      .slice(-6)
      .map(
        (msg) =>
          `${msg.role === "user" ? "Customer" : "AI"}: ${msg.content}`
      )
      .join("\n");
  }

  async handleSupervisorResponse(requestId, answer) {
    try {
      const request = await helpRequest.get(requestId);

      if (!request) throw new Error("Help request not found");

      await helpRequest.resolve(requestId, answer);

      await knowledgeBase.add({
        question: request.question,
        answer,
        category: "learned",
        confidence: 0.9,
        source: "supervisor",
        requestId,
      });

      await notification.callbackCustomer(request, answer);

      await this.initialize();

      console.log("✅ Supervisor response processed + KB updated");

      return { success: true, requestId };
    } catch (err) {
      console.error("❌ Supervisor response error:", err);
      throw err;
    }
  }

  clearSession(sessionId) {
    this.conversationHistory.delete(sessionId);
  }

  getActiveSessionsCount() {
    return this.conversationHistory.size;
  }
}

module.exports = new AIAgentService();
