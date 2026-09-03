import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useOS } from '../../context/OSContext.jsx';
import { tasksService } from '../../services/tasks.service.js';
import { notesService } from '../../services/notes.service.js';
import { chatService } from '../../services/chat.service.js';
import { memoryService } from '../../services/memory.service.js';
import { NexusCoreOrb } from '../common/NexusCoreOrb.jsx';
import { Badge } from '../common/Badge.jsx';
import { 
  Bot, 
  CheckSquare, 
  FileText, 
  Database, 
  MessageSquare, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Send,
  Plus,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export const HomeDashboard = () => {
  const { user } = useAuth();
  const { openApp } = useOS();
  const [commandInput, setCommandInput] = useState('');

  // Dashboard Stats
  const [stats, setStats] = useState({
    tasksToday: 0,
    totalConversations: 0,
    savedNotes: 0,
    memories: 0,
  });

  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [recentConversations, setRecentConversations] = useState([]);

  // Dynamic Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [taskData, noteData, convData, memData] = await Promise.allSettled([
          tasksService.getTasks({ status: 'all' }),
          notesService.getNotes(),
          chatService.getConversations(),
          memoryService.getMemories(),
        ]);

        const tasks = taskData.status === 'fulfilled' ? taskData.value : [];
        const notes = noteData.status === 'fulfilled' ? noteData.value : [];
        const convs = convData.status === 'fulfilled' ? convData.value : [];
        const mems = memData.status === 'fulfilled' ? memData.value : [];

        setStats({
          tasksToday: tasks.filter((t) => t.status !== 'completed').length,
          totalConversations: convs.length,
          savedNotes: notes.length,
          memories: mems.length,
        });

        setUpcomingTasks(tasks.slice(0, 4));
        setRecentConversations(convs.slice(0, 4));
      } catch (err) {
        console.error('Dashboard data load warning:', err);
      }
    };
    fetchDashboardData();
  }, []);

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    openApp('chat', commandInput.trim());
  };

  const sampleCommands = [
    { label: 'Explain React hooks', prompt: 'Explain React hooks simply with practical use cases.' },
    { label: 'Create a task', prompt: 'Create a task to practice React hooks tomorrow with high priority.' },
    { label: 'Plan study schedule', prompt: 'Plan how I can learn MERN stack in 30 days.' },
    { label: 'Help debug Node API', prompt: 'Write an Express API for user registration with bcrypt and JWT.' },
    { label: 'Write MongoDB schema', prompt: 'Design a high-performance MongoDB schema for an AI chat app.' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto h-[calc(100vh-3.5rem)] overflow-y-auto space-y-6">
      {/* Hero Greeting */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                NEXUS AI Operating System
              </span>
              <Badge variant="cyan" size="xs">
                v1.0 Online
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              {getGreeting()}, {user?.name || 'Developer'} 👋
            </h1>
            <p className="text-xs md:text-sm text-slate-400">
              What would you like NEXUS to accomplish today?
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-4">
            <NexusCoreOrb size="lg" state="idle" />
          </div>
        </div>

        {/* Large AI Command Input */}
        <form onSubmit={handleCommandSubmit} className="mt-6 relative z-10">
          <div className="glass-dropdown rounded-2xl p-2 pl-4 flex items-center gap-3 border border-white/15 focus-within:border-cyan-500/60 shadow-2xl transition">
            <Sparkles size={18} className="text-cyan-400 shrink-0" />
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Ask NEXUS anything (e.g. 'Create a task to finish React project tomorrow')..."
              className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-semibold shadow-md hover:opacity-90 transition flex items-center gap-1.5"
            >
              <span>Execute</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>

        {/* Suggested Quick Commands */}
        <div className="mt-4 flex flex-wrap items-center gap-2 relative z-10">
          <span className="text-[11px] text-slate-400">Suggestions:</span>
          {sampleCommands.map((cmd, idx) => (
            <button
              key={idx}
              onClick={() => openApp('chat', cmd.prompt)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-white/5 transition"
            >
              &quot;{cmd.label}&quot;
            </button>
          ))}
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Widget 1: Tasks */}
        <div
          onClick={() => openApp('tasks')}
          className="glass-panel rounded-2xl p-4 border border-white/10 glass-panel-hover cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Pending Tasks</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckSquare size={16} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">{stats.tasksToday}</span>
            <span className="text-[11px] text-slate-500 ml-1.5">active</span>
          </div>
        </div>

        {/* Widget 2: Conversations */}
        <div
          onClick={() => openApp('chat')}
          className="glass-panel rounded-2xl p-4 border border-white/10 glass-panel-hover cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Conversations</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <MessageSquare size={16} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">{stats.totalConversations}</span>
            <span className="text-[11px] text-slate-500 ml-1.5">sessions</span>
          </div>
        </div>

        {/* Widget 3: Notes */}
        <div
          onClick={() => openApp('notes')}
          className="glass-panel rounded-2xl p-4 border border-white/10 glass-panel-hover cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Saved Notes</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <FileText size={16} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">{stats.savedNotes}</span>
            <span className="text-[11px] text-slate-500 ml-1.5">documents</span>
          </div>
        </div>

        {/* Widget 4: AI Memory */}
        <div
          onClick={() => openApp('memory')}
          className="glass-panel rounded-2xl p-4 border border-white/10 glass-panel-hover cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Memory Items</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <Database size={16} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">{stats.memories}</span>
            <span className="text-[11px] text-slate-500 ml-1.5">stored facts</span>
          </div>
        </div>
      </div>

      {/* Dual Section: Upcoming Tasks & Recent Conversations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
        {/* Upcoming Tasks Section */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <CheckSquare size={16} className="text-emerald-400" />
                <span>Upcoming Tasks</span>
              </h2>
              <button
                onClick={() => openApp('tasks')}
                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight size={11} />
              </button>
            </div>

            <div className="space-y-2">
              {upcomingTasks.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No tasks scheduled.</p>
              ) : (
                upcomingTasks.map((t) => (
                  <div
                    key={t._id}
                    className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div className="truncate flex-1 pr-2">
                      <p className={`text-slate-200 truncate ${t.status === 'completed' ? 'line-through text-slate-500' : ''}`}>
                        {t.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {t.createdBy === 'ai' && (
                        <Badge variant="ai" size="xs">
                          AI
                        </Badge>
                      )}
                      <Badge variant={t.priority} size="xs">
                        {t.priority}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity / Conversations */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Clock size={16} className="text-indigo-400" />
                <span>Recent Conversations</span>
              </h2>
              <button
                onClick={() => openApp('chat')}
                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>Open Chat</span>
                <ArrowRight size={11} />
              </button>
            </div>

            <div className="space-y-2">
              {recentConversations.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No conversation history.</p>
              ) : (
                recentConversations.map((c) => (
                  <div
                    key={c._id}
                    onClick={() => openApp('chat')}
                    className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-800 transition"
                  >
                    <div className="truncate flex-1 pr-2">
                      <p className="text-slate-200 truncate font-medium">{c.title}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(c.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
