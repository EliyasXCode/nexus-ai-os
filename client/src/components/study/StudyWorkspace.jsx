import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { agentsService } from '../../services/agents.service.js';
import { 
  GraduationCap, 
  Lightbulb, 
  HelpCircle, 
  FileText, 
  CheckCircle, 
  Search, 
  Sparkles,
  BookOpen
} from 'lucide-react';

export const StudyWorkspace = () => {
  const [topic, setTopic] = useState('JavaScript Closures and Event Loop');
  const [mode, setMode] = useState('simple');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const studyModes = [
    { id: 'simple', label: 'Explain Simply', icon: Lightbulb, desc: 'Real-world analogies & simplified breakdowns' },
    { id: 'interview', label: 'Interview Mode', icon: HelpCircle, desc: 'Realistic interview questions & model answers' },
    { id: 'quiz', label: 'Quiz Me', icon: CheckCircle, desc: 'Interactive multiple choice questions' },
    { id: 'notes', label: 'Revision Notes', icon: FileText, desc: 'Quick cheat-sheet summary & definitions' },
  ];

  const popularTopics = [
    'JavaScript Event Loop & Microtasks',
    'React Virtual DOM vs Real DOM',
    'MongoDB Indexing & B-Trees',
    'JWT Authentication & Refresh Tokens',
    'REST API vs GraphQL Architecture',
    'SQL Joins vs NoSQL Denormalization',
  ];

  const handleGenerate = async (targetMode = mode, targetTopic = topic) => {
    if (!targetTopic.trim()) return;
    setIsLoading(true);
    try {
      const res = await agentsService.studyAssist({
        topic: targetTopic,
        mode: targetMode,
      });
      setOutput(res);
    } catch (err) {
      setOutput(`⚠️ **Study Hub Error**: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Header */}
      <div className="pb-4 border-b border-white/10">
        <h1 className="text-2xl font-bold flex items-center gap-2.5 text-white">
          <GraduationCap className="text-rose-400" />
          <span>Study & Interview Hub</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Powered by Study Agent. Master full-stack concepts, test yourself with quizzes, and prepare for tech interviews.
        </p>
      </div>

      {/* Input topic and popular chips */}
      <div className="my-4 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a concept (e.g. React Reconciliation, SQL Transactions, Docker)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/90 border border-white/10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>
          <button
            onClick={() => handleGenerate()}
            disabled={isLoading || !topic.trim()}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-semibold shadow-lg shadow-rose-500/20 hover:opacity-90 disabled:opacity-40 transition flex items-center gap-2"
          >
            <Sparkles size={14} />
            <span>Generate</span>
          </button>
        </div>

        {/* Quick topic tags */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-500 mr-1">Trending Topics:</span>
          {popularTopics.map((t, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTopic(t);
                handleGenerate(mode, t);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-white/5 text-slate-300 hover:text-white hover:border-rose-500/30 transition"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {studyModes.map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                setMode(m.id);
                handleGenerate(m.id, topic);
              }}
              className={`p-3 rounded-2xl border text-left transition ${
                isActive
                  ? 'bg-rose-500/15 border-rose-500/40 text-white shadow-md'
                  : 'glass-panel border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold text-xs mb-1">
                <Icon size={14} className={isActive ? 'text-rose-400' : 'text-slate-400'} />
                <span>{m.label}</span>
              </div>
              <p className="text-[10px] text-slate-500 line-clamp-1">{m.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Study Content Output */}
      <div className="flex-1 glass-panel rounded-2xl border border-white/10 p-6 overflow-y-auto min-h-0">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Sparkles size={32} className="text-rose-400 animate-spin mb-3" />
            <p className="text-sm text-rose-300 font-medium">Study Agent preparing guide...</p>
            <p className="text-xs text-slate-500 mt-1">Generating beginner-friendly analogies and key takeaways</p>
          </div>
        ) : output ? (
          <div className="markdown-body max-w-none text-xs leading-relaxed">
            <ReactMarkdown>{output}</ReactMarkdown>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
            <BookOpen size={40} className="text-slate-600 mb-3" />
            <p className="text-sm font-medium text-slate-300">Ready to learn?</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Enter any technical topic above or select one of the trending topics to generate study guides, quiz questions, or interview prep.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
