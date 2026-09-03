import React from 'react';
import { Sparkles, CheckSquare, Code2, Calendar, Database, GraduationCap } from 'lucide-react';

export const PromptSuggestions = ({ onSelectPrompt }) => {
  const suggestions = [
    {
      label: 'Create High-Priority Task',
      prompt: 'Create a task to practice React hooks tomorrow with high priority.',
      icon: CheckSquare,
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
    },
    {
      label: 'Express Auth API',
      prompt: 'Give me a complete Node.js Express authentication API with JWT.',
      icon: Code2,
      color: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
    },
    {
      label: 'Store Long-Term Memory',
      prompt: 'Remember that I am currently learning MERN stack and preparing for developer interviews.',
      icon: Database,
      color: 'text-teal-400 border-teal-500/20 bg-teal-500/5',
    },
    {
      label: '30-Day MERN Roadmap',
      prompt: 'Plan how I can learn the MERN stack in 30 days with weekly milestones.',
      icon: Calendar,
      color: 'text-purple-400 border-purple-500/20 bg-purple-500/5',
    },
    {
      label: 'JavaScript Closures',
      prompt: 'Explain closures in JavaScript simply with code examples and analogies.',
      icon: GraduationCap,
      color: 'text-rose-400 border-rose-500/20 bg-rose-500/5',
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto my-4">
      {suggestions.map((item, idx) => {
        const Icon = item.icon;
        return (
          <button
            key={idx}
            onClick={() => onSelectPrompt(item.prompt)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs text-slate-300 hover:text-white transition-all hover:scale-105 ${item.color}`}
          >
            <Icon size={13} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
