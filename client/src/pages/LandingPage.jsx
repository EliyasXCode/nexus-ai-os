import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { NexusCoreOrb } from '../components/common/NexusCoreOrb.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { 
  Bot, 
  Cpu, 
  CheckSquare, 
  FileText, 
  Code2, 
  GraduationCap, 
  Database, 
  Mic, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Layers,
  Zap,
  Terminal,
  ChevronRight
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleLaunch = () => {
    if (isAuthenticated) {
      navigate('/os');
    } else {
      navigate('/auth?mode=login');
    }
  };

  const features = [
    {
      title: 'AI Assistant',
      desc: 'Central conversational intelligence powered by official Google Gemini 2.5 Flash API.',
      icon: Bot,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      title: 'Multi-Agent System',
      desc: 'Autonomous Supervisor classifying intents and routing requests to domain specialists.',
      icon: Cpu,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    {
      title: 'Smart Tasks',
      desc: 'Gemini function calling dynamically schedules, tags, and manages tasks directly into MongoDB.',
      icon: CheckSquare,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Intelligent Notes',
      desc: 'Knowledge base with AI bullet summarization and instant conversational exploration.',
      icon: FileText,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Coding Assistant',
      desc: 'Inspect algorithms, detect bugs, improve performance, and generate comprehensive unit tests.',
      icon: Code2,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'AI Planning & Roadmaps',
      desc: 'Decompose ambitious targets into step-by-step milestones with weekly deliverables.',
      icon: Layers,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Study & Interview Hub',
      desc: 'Simplified concept breakdowns, interview question generation, and interactive quizzes.',
      icon: GraduationCap,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
    {
      title: 'Voice & Multimodal Input',
      desc: 'Speak freely with browser speech-to-text and upload screenshots or diagrams for vision reasoning.',
      icon: Mic,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    },
  ];

  const specialistAgents = [
    {
      name: 'Coding Agent',
      badge: 'Full-Stack Specialist',
      role: 'Specialized in React, Node, Express, MongoDB, Python, SQL, REST APIs, and software debugging.',
      icon: Code2,
      accent: 'border-blue-500/30 text-blue-400',
    },
    {
      name: 'Task Agent',
      badge: 'Action & Execution',
      role: 'Directly executes createTask(), getTasks(), and updateTask() tools into the database.',
      icon: CheckSquare,
      accent: 'border-emerald-500/30 text-emerald-400',
    },
    {
      name: 'Notes Agent',
      badge: 'Knowledge Extraction',
      role: 'Organizes snippets, saves notes with tags, and generates instant takeaways.',
      icon: FileText,
      accent: 'border-amber-500/30 text-amber-400',
    },
    {
      name: 'Study Agent',
      badge: 'Interview & Learning',
      role: 'Simplifies difficult topics with metaphors, generates tech interview mock tests and quizzes.',
      icon: GraduationCap,
      accent: 'border-rose-500/30 text-rose-400',
    },
    {
      name: 'Planner Agent',
      badge: 'Goal Decomposition',
      role: 'Formulates realistic study schedules and project development timelines.',
      icon: Layers,
      accent: 'border-purple-500/30 text-purple-400',
    },
    {
      name: 'General Agent',
      badge: 'NEXUS Central Core',
      role: 'Brainstorming, user profile management, long-term memory, and arithmetic utilities.',
      icon: Bot,
      accent: 'border-cyan-500/30 text-cyan-400',
    },
  ];

  return (
    <div className="min-h-screen bg-nexus-bg text-slate-100 selection:bg-cyan-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-16 glass-dropdown border-b border-white/10 px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <NexusCoreOrb size="sm" state="idle" />
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold tracking-wider text-base bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              NEXUS
            </span>
            <span className="text-xs font-mono text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
              AI OS
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
          <a href="#features" className="hover:text-cyan-400 transition">Features</a>
          <a href="#agents" className="hover:text-cyan-400 transition">Agents</a>
          <a href="#architecture" className="hover:text-cyan-400 transition">Architecture</a>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/os')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 hover:opacity-90 transition flex items-center gap-1.5"
            >
              <span>Enter Desktop</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/auth?mode=login')}
                className="px-3.5 py-1.5 text-xs text-slate-300 hover:text-white transition"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/auth?mode=register')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 hover:opacity-90 transition"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto text-center relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-cyan-500/15 via-indigo-500/15 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-cyan-300 text-xs shadow-nexus-glow">
            <Sparkles size={13} className="animate-spin text-cyan-400" />
            <span>Autonomous Multi-Agent Web Operating System</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            NEXUS <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">AI OS</span>
          </h1>

          <p className="text-lg sm:text-xl font-medium text-slate-300">
            Your intelligent workspace powered by autonomous AI agents.
          </p>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Chat, plan, code, organize, and automate everyday work from one unified browser-based operating system. Powered by Google Gemini function calling and MongoDB.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleLaunch}
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 text-white font-semibold text-sm shadow-xl shadow-cyan-500/25 hover:opacity-95 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Zap size={16} />
              <span>Launch AI OS</span>
            </button>

            <a
              href="#agents"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl glass-panel hover:bg-white/10 text-slate-300 hover:text-white font-medium text-sm transition border border-white/10 flex items-center justify-center gap-2"
            >
              <span>Explore Agents</span>
              <ChevronRight size={16} />
            </a>
          </div>
        </div>

        {/* Dashboard Preview Frame */}
        <div className="mt-16 relative mx-auto max-w-5xl rounded-2xl p-2 bg-gradient-to-b from-white/15 to-white/5 shadow-2xl border border-white/10">
          <div className="rounded-xl overflow-hidden glass-panel border border-white/10 shadow-2xl">
            {/* Fake Titlebar */}
            <div className="h-9 bg-slate-950/80 border-b border-white/10 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[11px] font-mono text-slate-400">nexus-ai-os // workspace: desktop</span>
              <div className="text-[10px] text-emerald-400 font-mono">● LIVE</div>
            </div>

            {/* Desktop Mockup Preview */}
            <div className="p-6 md:p-8 bg-slate-950/60 text-left space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <NexusCoreOrb size="sm" state="idle" />
                  <span className="text-xs font-semibold text-white">NEXUS Central Command</span>
                </div>
                <Badge variant="ai" size="xs">Supervisor Active</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="glass-panel p-4 rounded-xl border border-white/10">
                  <p className="text-slate-400 text-[11px] mb-1">Incoming Intent</p>
                  <p className="text-white font-mono">&quot;Create a high priority task to practice React tomorrow&quot;</p>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5">
                  <p className="text-cyan-400 text-[11px] mb-1">Supervisor Decision</p>
                  <p className="text-white font-mono">Routing ➔ Task Agent (createTask tool)</p>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                  <p className="text-emerald-400 text-[11px] mb-1">Database Execution</p>
                  <p className="text-white font-mono">Task saved to MongoDB Atlas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Cards */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <Badge variant="cyan">System Capabilities</Badge>
          <h2 className="text-3xl font-bold text-white">Engineered for Autonomous Productivity</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Every workspace in NEXUS AI OS communicates seamlessly with Google Gemini and your personal database.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="glass-panel rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${f.color}`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Specialist Agents Section */}
      <section id="agents" className="py-20 px-6 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <Badge variant="purple">Multi-Agent Intelligence</Badge>
          <h2 className="text-3xl font-bold text-white">One AI. Multiple Specialists.</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Instead of a generic chatbot, NEXUS routes requests to specialized agents with dedicated system prompts and toolchains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {specialistAgents.map((ag, idx) => {
            const Icon = ag.icon;
            return (
              <div
                key={idx}
                className={`glass-panel rounded-2xl p-5 border ${ag.accent} flex flex-col justify-between hover:scale-[1.02] transition-all`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
                      <Icon size={20} />
                    </div>
                    <Badge variant="default" size="xs">
                      {ag.badge}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">{ag.name}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{ag.role}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Architecture Flow Section */}
      <section id="architecture" className="py-20 px-6 max-w-5xl mx-auto border-t border-white/10 text-center">
        <Badge variant="cyan">MERN + Gemini Pipeline</Badge>
        <h2 className="text-3xl font-bold text-white mt-2 mb-4">Architecture & Data Flow</h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mb-10">
          Clean decoupled design built with React, Node/Express, MongoDB Atlas, and the official Google Gemini SDK.
        </p>

        <div className="glass-panel rounded-2xl p-6 md:p-8 border border-white/10 text-left font-mono text-xs overflow-x-auto">
          <div className="flex flex-col items-center gap-3 min-w-[500px]">
            <div className="px-5 py-2.5 rounded-xl bg-slate-900 border border-white/20 text-cyan-300 font-bold">
              USER INTERACTION (React + Tailwind UI)
            </div>
            <div className="text-slate-500">↓ HTTP / REST / Cookie JWT</div>
            <div className="px-5 py-2.5 rounded-xl bg-slate-900 border border-white/20 text-indigo-300 font-bold">
              EXPRESS BACKEND (Helmet, CORS, Rate Limit, Auth)
            </div>
            <div className="text-slate-500">↓ Supervisor Classifier</div>
            <div className="grid grid-cols-6 gap-2 w-full text-center text-[10px]">
              <span className="p-2 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-200">GENERAL</span>
              <span className="p-2 rounded bg-blue-950/60 border border-blue-500/30 text-blue-200">CODING</span>
              <span className="p-2 rounded bg-purple-950/60 border border-purple-500/30 text-purple-200">PLANNER</span>
              <span className="p-2 rounded bg-rose-950/60 border border-rose-500/30 text-rose-200">STUDY</span>
              <span className="p-2 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-200">TASK</span>
              <span className="p-2 rounded bg-amber-950/60 border border-amber-500/30 text-amber-200">NOTES</span>
            </div>
            <div className="text-slate-500">↕ Function Calling & Tool Registry</div>
            <div className="px-5 py-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 font-bold">
              MONGODB ATLAS (Tasks, Notes, Memory, Runs)
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10 text-center text-xs text-slate-500">
        <p>© 2025 NEXUS AI OS. Built with MERN Stack + Google Gemini API.</p>
      </footer>
    </div>
  );
};
