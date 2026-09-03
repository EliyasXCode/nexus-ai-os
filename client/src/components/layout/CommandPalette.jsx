import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '../../context/OSContext.jsx';
import { 
  Search, 
  Bot, 
  CheckSquare, 
  FileText, 
  Code2, 
  GraduationCap, 
  Database, 
  Settings, 
  ArrowRight,
  Sparkles,
  Command
} from 'lucide-react';

export const CommandPalette = () => {
  const { commandPaletteOpen, setCommandPaletteOpen, openApp } = useOS();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const baseCommands = [
    {
      id: 'ask-nexus',
      title: 'Ask NEXUS AI',
      subtitle: 'Dispatch query to multi-agent orchestrator',
      icon: Bot,
      color: 'text-cyan-400',
      action: (q) => openApp('chat', q || 'Hello NEXUS, what can you do?'),
    },
    {
      id: 'create-task',
      title: 'Create a new Task',
      subtitle: 'Add to-do item to Task Manager',
      icon: CheckSquare,
      color: 'text-emerald-400',
      action: () => openApp('tasks'),
    },
    {
      id: 'create-note',
      title: 'Create a new Note',
      subtitle: 'Store technical documentation or revision notes',
      icon: FileText,
      color: 'text-amber-400',
      action: () => openApp('notes'),
    },
    {
      id: 'code-assistant',
      title: 'Open Code Assistant',
      subtitle: 'Explain code, debug errors, and optimize functions',
      icon: Code2,
      color: 'text-blue-400',
      action: () => openApp('code'),
    },
    {
      id: 'study-hub',
      title: 'Open Study & Interview Hub',
      subtitle: 'Generate mock questions, quizzes, and revision guides',
      icon: GraduationCap,
      color: 'text-rose-400',
      action: () => openApp('study'),
    },
    {
      id: 'ai-memory',
      title: 'Manage AI Memory',
      subtitle: 'View and control long-term stored preferences',
      icon: Database,
      color: 'text-teal-400',
      action: () => openApp('memory'),
    },
    {
      id: 'open-settings',
      title: 'System Settings',
      subtitle: 'Customize theme, model, and activity logs',
      icon: Settings,
      color: 'text-slate-400',
      action: () => openApp('settings'),
    },
  ];

  const filteredCommands = query.trim()
    ? baseCommands.filter(
        (cmd) =>
          cmd.title.toLowerCase().includes(query.toLowerCase()) ||
          cmd.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : baseCommands;

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        executeCommand(filteredCommands[selectedIndex]);
      } else if (query.trim()) {
        // Direct ask
        openApp('chat', query.trim());
        setCommandPaletteOpen(false);
      }
    }
  };

  const executeCommand = (command) => {
    command.action(query);
    setCommandPaletteOpen(false);
  };

  if (!commandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
      <div
        onClick={() => setCommandPaletteOpen(false)}
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
      />

      <div className="relative z-10 w-full max-w-xl glass-dropdown rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-slate-900/60">
          <Search size={20} className="text-cyan-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or ask NEXUS anything..."
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-400 text-sm focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-black/40 rounded border border-white/10 text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {query.trim() && (
            <button
              onClick={() => {
                openApp('chat', query);
                setCommandPaletteOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-medium transition border border-cyan-500/20"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles size={16} />
                <span>Ask NEXUS: &quot;{query}&quot;</span>
              </div>
              <ArrowRight size={14} />
            </button>
          )}

          {filteredCommands.map((cmd, idx) => {
            const Icon = cmd.icon;
            const isSelected = idx === selectedIndex;

            return (
              <button
                key={cmd.id}
                onClick={() => executeCommand(cmd)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition ${
                  isSelected
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-slate-800/80 ${cmd.color}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{cmd.title}</p>
                    <p className="text-xs text-slate-400">{cmd.subtitle}</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-slate-500" />
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 bg-slate-950/80 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="font-mono text-cyan-400/80">NEXUS Command Engine</span>
        </div>
      </div>
    </div>
  );
};
