# 📞 Aura AI – Voice Agent + Supervisor Dashboard

### **LiveKit • Python Voice Agent • Deepgram STT • Cartesia TTS • Node.js Backend • Supervisor UI**

Aura AI is a **real-time voice AI receptionist** that answers phone calls, understands natural speech, responds using AI, and escalates questions to a human supervisor when needed.

This project demonstrates:

* Real-time conversational AI
* Human fallback workflow
* Knowledge base that grows automatically
* Real-time dashboard for managing escalations
* Clean architecture, modular components, and self-improving behavior

---

# 🌟 Features Overview

### 🎙️ **Voice AI Agent**

* Built using **LiveKit Python Agents SDK**
* Listens to callers via **Deepgram STT**
* Speaks responses via **Cartesia TTS**
* Converts speech ↔ text in real time
* If unsure → triggers a help request and informs caller

---

### 🧠 **Node.js Backend**

* Routes messages from agent
* Checks Knowledge Base
* Runs AI reasoning (Groq / OpenAI / Gemini)
* Determines whether:
  ✓ AI can answer
  ✗ Supervisor help needed
* Stores help requests + knowledge items

---

### 🧑‍💼 **Supervisor Dashboard**

* Live list of pending help requests
* Resolve or reject help requests
* View request history
* Knowledge base management
* Real-time statistics (automation rate, resolution time)

---

# 🏗 System Architecture Diagram
                      ┌────────────────────────────┐
                      │        Caller Phone        │
                      │     (Voice Conversation)   │
                      └───────────────┬────────────┘
                                      │
                                      ▼
                        Real-time Audio (WebRTC)
                                      │
                                      ▼
                 ┌────────────────────────────────────────┐
                 │      LiveKit Cloud (Voice Router)      │
                 │  - Handles call signaling              │
                 │  - Streams audio to/from agent         │
                 └───────────────┬────────────────────────┘
                                  │
                                  ▼
                   ┌───────────────────────────────  ┐
                   │   Python Voice Agent (agent.py) │
                   │─────────────────────────────────│
                   │ • Deepgram STT (speech → text)  │
                   │ • Sends text to Backend API     │
                   │ • Receives text answer          │
                   │ • Cartesia TTS (text → speech)  │
                   │ • Speaks back to caller         │
                   └───────────────┬─────────────────┘
                                   │ HTTP (JSON API)
                                   ▼
                   ┌──────────────────────────────────────┐
                   │        Node.js Backend API           │
                   │──────────────────────────────────────│
                   │ • /process-message route             │
                   │ • Matches Knowledge Base             │
                   │ • Uses LLM when needed               │
                   │ • Creates help requests              │
                   │ • Stores logs + stats                │
                   └──────────────┬────────────────────── ┘
                                  │ Firestore SDK
                                  ▼
                     ┌────────────────────────────────┐
                     │   Firebase Firestore Database  │
                     │────────────────────────────────│
                     │ • knowledge/ (KB entries)      │
                     │ • requests/ (pending/resolved) │
                     │ • stats/ (metrics)             │
                     └───────┬────────────────────────┘
                             │  Fetch / Listen
                             ▼
                 ┌───────────────────────────────────────── ┐
                 │        Supervisor Dashboard (Web)        │
                 │──────────────────────────────────────────│
                 │ • View pending requests                  │
                 │ • Submit supervisor answers              │
                 │ • Manage knowledge base                  │
                 │ • View history + statistics              │
                 └───────────────────────────────────────── ┘



---

# 🔁 Help Request Lifecycle

Every help request goes through:

```
pending → resolved OR timeout
```

### **1. Pending**

Created when AI doesn’t know the answer.

Stored example:

```json
{
  "caller": "Priya",
  "question": "What is the Luna package price?",
  "context": "...",
  "status": "pending",
  "createdAt": 1234567890
}
```

### **2. Resolved**

Supervisor submits an answer.

* Backend updates DB
* Voice agent calls back the caller
* Knowledge base updates

### **3. Timeout**

If no supervisor response in 5 minutes, status becomes `"timeout"`.

---

# 🧩 Design Decisions

### **1. LiveKit for Real-Time Voice**

* Extremely low latency
* Simplest WebRTC agent SDK
* Event-driven call handling

### **2. Deepgram STT**

* Free tier
* Very fast streaming
* Accurate for phone-quality audio

### **3. Cartesia TTS**

* Natural human-like tone
* Non-streaming mode works reliably
* Lightweight & simple integration

### **4. Firebase Firestore**

* Schemaless, fast prototyping
* Real-time dashboard updates
* Zero maintenance

### **5. Modular Separation**

* Voice Agent = audio handling
* Backend = business logic
* Dashboard = human UI

This separation allows **horizontal scaling** per component.

---

# 📊 Project Structure

```
├── backend/
|   |── public/
|       ├── index.html
|       ├── style.css
|       ├── app.js
│   ├── src/
│   │   ├── config/
│   │   ├── services/
│   │   └── server.js
│   ├── package.json
│   └── .env
│
├── voice-agent/
│   ├── agent.py
│   ├── requirements.txt
│   └── .env
│

```

---

# ⚙ Setup Instructions

---

## 1️⃣ Clone the Repo

```sh
git clone https://github.com/Neha-Waddi/aura-voice-agent
cd aura-voice-agent
```

---

## 2️⃣ Backend Setup (Node.js)

```sh
cd backend
npm install
```

Environment variables:

```
FIREBASE_PROJECT_ID=your_project
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@project.iam.gserviceaccount.com

GEMINI_API_KEY=xxxx
PORT=3000
```

Run backend:

```sh
npm start
```

---

## 3️⃣ Voice Agent Setup (Python)

```sh
cd voice-agent
pip install -r requirements.txt
```

`.env`:

```
LIVEKIT_URL=wss://your-url.livekit.cloud
LIVEKIT_API_KEY=xxxx
LIVEKIT_API_SECRET=xxxx

DEEPGRAM_API_KEY=xxxx
CARTESIA_API_KEY=xxxx

BACKEND_API=http://localhost:3000/api
```

Run:

```sh
python agent.py dev
```

---
