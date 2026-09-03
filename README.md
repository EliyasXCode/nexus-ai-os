# 🌌 NEXUS AI OS — Web-Based AI Agent Operating System

[![Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20Gemini%20API-38bdf8)](https://github.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green)](https://nodejs.org)
[![Vite](https://img.shields.io/badge/Vite-6.x-purple)](https://vitejs.dev/)

**NEXUS AI OS** is an intelligent, browser-based agent operating system built on the **MERN stack** (MongoDB Atlas, Express.js, React, Node.js) and powered by the official **Google Gemini Developer API** (`@google/genai`).

Rather than acting as a simple conversational chatbot, NEXUS operates as an **Autonomous Multi-Agent Orchestrator** capable of understanding user intent, routing requests to specialized domain agents, and executing native backend tools (task creation, note curation, memory retention, math, and date queries) directly in the database.

---

## 🏛️ System Architecture

```text
                             USER
                              ↓
                          REACT UI (Vite + Tailwind CSS + Lucide)
                              ↓ HTTP / REST / HTTP-only JWT
                          EXPRESS API
                              ↓
                        AUTHENTICATION (bcryptjs + JWT Protect Middleware)
                              ↓
                       AI ORCHESTRATOR
                              ↓
                       SUPERVISOR AGENT (Intent Classifier)
                              ↓
      ┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
   GENERAL       CODING        PLANNER       STUDY         TASK         NOTES
  (Nexus Core) (Code/Debug)  (Roadmaps)  (Quiz/Interviews)(Workflows) (Knowledge)
      └─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
                              ↓
                          GEMINI API (Official @google/genai)
                              ↕ Function Calling Loop (Max 4 iterations)
                        TOOL REGISTRY
          (createTask, createNote, saveMemory, search, etc.)
                              ↓
                     APPLICATION SERVICES
                              ↓
                        MONGODB ATLAS (Tasks, Notes, Memory, Runs)
```

---

## ✨ Key Features

### 1. 🖥️ Futuristic AI Desktop Interface
- **Operating System Environment**: Features a Top Status Bar with real-time clock, active agent badge, and Gemini status indicator.
- **Floating Application Dock**: Quick access to Home, AI Assistant, Specialists, Tasks, Notes, Code Lab, Study Hub, AI Memory, and Settings.
- **Global Command Palette (`Ctrl + K`)**: Instant search and AI command execution from anywhere in the OS.
- **Responsive Layout**: Full OS experience on desktop, collapsible drawer and bottom navigation on mobile.

### 2. 🧠 Multi-Agent Architecture
- **Supervisor Agent**: Evaluates user prompts with structured JSON output and routes them to the ideal specialist agent.
- **Coding Specialist Agent**: Assists with full-stack JavaScript, React, Node, Express, MongoDB, Python, SQL, bug fixes, and unit tests (strict read/explain safety, no arbitrary server shell execution).
- **Task & Workflow Agent**: Equipped with tools to dynamically create, complete, list, and prioritize tasks directly in MongoDB.
- **Notes & Knowledge Agent**: Manages notes, tags, and generates instant AI summaries.
- **Planner & Roadmap Agent**: Formulates step-by-step 30-day schedules and learning roadmaps.
- **Study & Interview Hub**: Explains tough computer science topics simply, generates mock interview questions, and conducts quizzes.
- **NEXUS Central Assistant**: Handles general inquiries, user context, calculations, and memory.

### 3. 🛠️ Native Tool Calling System
- Tools: `createTask`, `getTasks`, `updateTask`, `completeTask`, `deleteTask`, `createNote`, `getNotes`, `searchNotes`, `updateNote`, `deleteNote`, `saveMemory`, `searchMemory`, `calculator`, `getCurrentDateTime`.
- **Validation**: Strict schema validation with Zod before database persistence.
- **Execution Loop**: Multi-turn execution loop (up to 4 iterations) allowing the AI to call tools, receive structured results, and formulate human confirmations.
- **Visual Trace**: Expandable **Agent Activity Timeline** in the chat UI revealing each step: `Request received ➔ Supervisor Intent ➔ Agent Selection ➔ Tool Execution ➔ Final Response`.

### 4. 🧠 User-Controlled AI Memory
- Controlled long-term memory: Remembers preferences and user goals only when prompted (e.g. *"Remember that I am learning MERN stack"*).
- Dedicated Memory Manager: View, edit, search, toggle ON/OFF, or securely clear all memory.

### 5. 🎙️ Voice & Multimodal Input
- **Browser Voice-to-Text**: Free native speech recognition via Web Speech API (`webkitSpeechRecognition`).
- **Vision Understanding**: Upload screenshots, diagrams, or code images for multimodal Gemini reasoning.

---

## 📂 Project Structure

```text
nexus-ai-os/
├── client/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── context/
│       │   ├── AuthContext.jsx          # User authentication state & methods
│       │   └── OSContext.jsx            # Desktop apps, active agent, Ctrl+K
│       ├── components/
│       │   ├── common/                  # Reusable UI (NexusCoreOrb, GlassCard, Badge, Modal)
│       │   ├── layout/                  # TopStatusBar, LeftDock, MobileNav, CommandPalette
│       │   ├── chat/                    # ChatWindow, MessageBubble, AgentActivityTimeline
│       │   ├── tasks/                   # TaskManager, TaskItem, filter pills
│       │   ├── notes/                   # NotesGrid, NoteModal, AI summary
│       │   ├── code/                    # CodeWorkspace (Explain, Find Bugs, Optimize, Tests)
│       │   ├── study/                   # StudyWorkspace (Simple, Interview Mode, Quiz)
│       │   ├── memory/                  # MemoryManager & safety controls
│       │   ├── agents/                  # AgentsOverview & execution run logs
│       │   ├── home/                    # HomeDashboard widgets & quick prompts
│       │   └── settings/                # SettingsPage (Theme, AI model, toggles)
│       ├── pages/
│       │   ├── LandingPage.jsx          # Public hero & architectural overview
│       │   ├── AuthPage.jsx             # Register / Login modal
│       │   └── DesktopPage.jsx          # Main AI OS Desktop container
│       └── services/                    # Axios API client modules
│
├── server/
│   ├── package.json
│   ├── .env                             # Environment secrets (gitignored)
│   ├── .env.example
│   └── src/
│       ├── server.js                    # Express application entrypoint
│       ├── config/
│       │   └── db.js                    # Mongoose connection
│       ├── middleware/
│       │   ├── auth.middleware.js       # JWT cookie & header verification
│       │   └── error.middleware.js      # Global error and 404 handlers
│       ├── models/
│       │   ├── User.js                  # User schema with bcrypt
│       │   ├── Conversation.js          # Chat history & tool traces
│       │   ├── Task.js                  # Tasks with AI vs user badges
│       │   ├── Note.js                  # Markdown notes & tags
│       │   ├── Memory.js                # Long-term AI memory records
│       │   └── AgentRun.js              # Pipeline monitoring & execution logs
│       ├── agents/
│       │   ├── supervisor.agent.js      # Intent classifier
│       │   ├── general.agent.js
│       │   ├── coding.agent.js
│       │   ├── planner.agent.js
│       │   ├── study.agent.js
│       │   ├── task.agent.js
│       │   ├── notes.agent.js
│       │   └── agent.orchestrator.js    # Multi-agent loop & memory injection
│       ├── tools/
│       │   ├── tool.registry.js         # Central registry & Gemini declarations
│       │   ├── task.tools.js            # Task CRUD tool implementations
│       │   ├── note.tools.js            # Note CRUD tool implementations
│       │   └── utility.tools.js         # Math, Date, Memory tools
│       ├── services/
│       │   └── gemini.service.js        # @google/genai SDK wrapper
│       ├── routes/                      # Express REST endpoints
│       └── controllers/                 # Request business logic
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB Atlas**: Free cluster database connection string
- **Google Gemini API Key**: From [Google AI Studio](https://aistudio.google.com/)

---

### Step 1: Clone or Navigate to Directory
```bash
cd nexus-ai-os
```

---

### Step 2: Configure Environment Variables

Create `server/.env` (a template is provided in `server/.env.example`):

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@nexus-ai-cluster.swp4umh.mongodb.net/nexus_ai_os?retryWrites=true&w=majority&appName=nexus-ai-cluster
JWT_SECRET=nexus_ai_os_ultra_secure_jwt_secret_key_2025_prod_auth
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
ENABLE_GOOGLE_SEARCH_GROUNDING=false
```

> **Note**: Gemini API keys and MongoDB credentials MUST remain on the backend server. They are never exposed to the frontend client.

---

### Step 3: Install Dependencies

#### Install Backend Dependencies:
```bash
cd server
npm install
```

#### Install Frontend Dependencies:
```bash
cd ../client
npm install
```

---

### Step 4: Run the Application

#### Option A: Run Server and Client in Separate Terminals

**Terminal 1 (Backend Server):**
```bash
cd server
npm run dev
```
*Server will start at `http://localhost:5000` and connect to MongoDB Atlas.*

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
```
*Client will start at `http://localhost:5173`.*

---

## 🎯 Verification & Demo Walkthrough

Once running, visit `http://localhost:5173`:

1. **Registration / Login**:
   - Register a new account (e.g. `Eliyas Mulla`, `eliyas@example.com`).
   - You will be redirected to `/os` with a personalized greeting: *"Good evening, Eliyas 👋"*.

2. **Demo 1: Task Agent & Tool Calling**:
   - In the AI Chat, type:
     > *"Create a task to practice React hooks tomorrow with high priority."*
   - Watch the **Agent Activity Pipeline** expand:
     - `Supervisor Evaluating` ➔ `Agent Selected: TASK` ➔ `Tool Invoked: createTask` ➔ `Tool Completed` ➔ `Response Generated`.
   - Switch to the **Tasks** workspace in the left dock:
     - See *"Practice React hooks"* with **HIGH** priority badge and **NEXUS AI** badge!

3. **Demo 2: Coding Specialist Agent**:
   - In the AI Chat, type:
     > *"Give me a Node.js Express authentication API with JWT."*
   - Notice the Supervisor routes to `CODING`.
   - The response renders styled syntax-highlighted code with a one-click **Copy** button.

4. **Demo 3: Long-Term Memory**:
   - In the AI Chat, type:
     > *"Remember that I am currently learning MERN stack."*
   - The Supervisor routes to `GENERAL/MEMORY` ➔ calls `saveMemory`.
   - Switch to the **AI Memory** app in the dock to view the remembered fact with its category!

5. **Demo 4: Code Lab & Study Hub**:
   - Open **Code Lab** from the dock: paste code and click *"Find Bugs"* or *"Generate Tests"*.
   - Open **Study Hub** from the dock: type *"Event Loop"* and select *"Interview Mode"* or *"Quiz Me"*.

---

## 🔒 Security Architecture

1. **JWT in HTTP-only Cookies**: Prevents Cross-Site Scripting (XSS) credential theft.
2. **User Isolation**: All database operations (`Task`, `Note`, `Memory`, `Conversation`, `AgentRun`) are strictly scoped to `req.user._id`.
3. **Zod Validation**: All tool arguments and incoming API bodies are parsed and validated against strict schemas before execution.
4. **Safe Evaluation**: Arithmetic tools use strict regex character whitelisting. No `eval()` or `child_process` execution is ever permitted.
5. **Helmet & Rate Limiting**: Express rate limiter protects against abusive request floods, while Helmet manages secure HTTP response headers.

---

## 👨‍💻 Author & Portfolio

**Eliyas Mulla**  
Full-Stack & Generative AI Developer  
Built for technical demonstrations and fresher full-stack portfolio review.
