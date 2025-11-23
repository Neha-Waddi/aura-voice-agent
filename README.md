# 📞 Aura AI – Voice Agent + Supervisor Dashboard

### Real-time AI Phone Agent · LiveKit + Deepgram + Cartesia · Node.js + Python +   Dashboard

Aura AI is a **fully functional voice-based AI phone receptionist** built using **LiveKit**, **Deepgram STT**, **Cartesia TTS**, a **Node.js backend**, and a modern **Supervisor Dashboard** for human fallback.

The agent can:

* Answer phone calls in real-time
* Hear the caller via Deepgram STT
* Respond using Cartesia TTS
* Escalate questions it cannot handle
* Store + use a growing Knowledge Base
* Provide live logs to a supervisor dashboard
* Allow a supervisor to respond manually

---

## 🚀 Features

### 🎙 Voice AI Agent

* Real-time two-way audio streaming
* Cartesia TTS 
* Deepgram Nova-2 STT 
* Detects caller speech + generates responses
* Automatic fallback when AI is not confident
* Works with LiveKit Voice Agent Playground

---

### 🧑‍💼 Supervisor Dashboard 


* Live list of *pending*, *resolved*, and *timed-out* help requests
* Knowledge base list + add/edit/delete
* Statistics panel (total requests, resolution times, etc.)
* Modal system for responding to help requests

---

### 🧠 Node.js Backend API

* Handles `/process-message` route
* AI processing using OpenAI / Groq / any LLM
* Knowledge base storage
* Fallback escalation system
* Logs every request + supervisor response

---

## 📁 Project Structure

```

├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── services/
│   │   └── server.js
│   ├── public/
│   ├── package.json
│   └── .env
│
├── voice-agent/
│   ├── agent.py
│   ├── requirements.txt
│   ├── venv/
│   └── .env
│
└── README.md
```

---

## 🛠 Tech Stack

### Voice layer:

* **LiveKit Agents SDK (Python)**
* **Deepgram STT**
* **Cartesia TTS (non-streaming)**
* **WebRTC audio streaming**

### Backend:

* **Node.js + Express**
* **Any LLM API (Groq, OpenAI, Gemini, etc.)**
* **Firebase Admin SDK – Firestore database**

### Frontend Dashboard:

* Vanilla JavaScript – Lightweight and fast
* Modern CSS – Responsive dashboard design
* Fetch API – REST communication

---

## 🔧 Setup Instructions

### 1️⃣ Clone the repo

```sh
git clone https://github.com/Neha-Waddi/aura-voice-agent
cd aura-voice-agent
```

---

## 2️⃣ Backend Setup (Node.js)

Install packages:

```sh
cd backend
npm install
```

Create `.env`:

```
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nPrivate\nKey\nHere\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Google Gemini Configuration
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxx

# Server Configuration
PORT=3000
NODE_ENV=development

# Business Information
BUSINESS_NAME=Aura Salon
BUSINESS_PHONE=+919898989898
SUPERVISOR_PHONE=+91878795951
SUPERVISOR_NAME=Your Name
```

Start server:

```sh
npm start
```

---

## 3️⃣ Voice Agent Setup (Python)

Install:

```sh
pip install livekit-agents livekit-rtc aiohttp python-dotenv requests
```

`.env`:

```
LIVEKIT_URL=wss://your-livekit-server.livekit.cloud
LIVEKIT_API_KEY=xxxx
LIVEKIT_API_SECRET=xxxx

DEEPGRAM_API_KEY=xxxx
CARTESIA_API_KEY=xxxx

BACKEND_API=http://localhost:3000/api
BUSINESS_NAME=Aura Salon
```

Run agent:

```sh
cd voice-agent
python agent.py dev
```

---

## 🚀 How It Works (Example Flow)


### **1️⃣ Customer Calls Your Business Number**

The call is routed to LiveKit → your Python Voice Agent connects and starts listening.

**Agent:**
“Hello! Thank you for calling *Aura Salon*. How may I help you today?”

---

### **2️⃣ Customer Asks a Question**

Customer speaks:

**Caller:**
“What services do you offer?”

Deepgram STT converts speech → pure text in less than a second.

---

### **3️⃣ AI Backend Processes the Text**

Your Node.js backend checks:

* 🔍 **Knowledge base**
* 🔄 **Past similar questions**
* 🤖 **AI model (fallback)**
* 🧑‍💼 **Whether supervisor help is needed**

Backend responds:

```
"We offer haircuts, hair coloring, styling, manicures, pedicures, facials, massages, and waxing services."
```

---

### **4️⃣ AI Speaks Back to Caller**

Cartesia TTS converts the response into natural audio → sent back over LiveKit.

**Agent:**
“We offer haircuts, coloring, manicures, facials, massages, and more!”

---

### **5️⃣ If AI Is Unsure → Human Supervisor**

Example:

**Caller:**
“Luna package price please?”

Backend can't answer → triggers escalation:

* Supervisor receives Notification
* Supervisor replies in dashboard
* Answer is saved into KB for future calls

---

### **6️⃣ System Learns Automatically**

The new answer becomes part of the knowledge base:

* Future callers get instant replies
* No supervisor needed next time
* KB grows automatically with each human correction

---

### **7️⃣ Real-Time Dashboard Updates**

Supervisor dashboard shows:

* 🟡 Pending help requests
* 🟢 Resolved requests
* 📚 Knowledge base
* 📊 Statistics (resolution time, automation rate)

---

### **End Result**

A fully automated AI receptionist that:

* Answers 90% of calls automatically
* Escalates only when needed
* Learns continuously from supervisor input
* Speaks naturally with real-time voice

