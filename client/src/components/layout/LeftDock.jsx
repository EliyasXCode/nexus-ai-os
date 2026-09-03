import React from 'react';
import { useOS } from '../../context/OSContext.jsx';
import { 
  Home, 
  Bot, 
  Cpu, 
  CheckSquare, 
  FileText, 
  Code2, 
  GraduationCap, 
  Database, 
  Settings 
} from 'lucide-react';

export const LeftDock = () => {
  const { activeApp, openApp } = useOS();

  const dockApps = [
    { id: 'home', label: 'Home', icon: Home, color: 'hover:text-cyan-400' },
    { id: 'chat', label: 'AI Assistant', icon: Bot, color: 'hover:text-indigo-400' },
    { id: 'agents', label: 'Specialists', icon: Cpu, color: 'hover:text-purple-400' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, color: 'hover:text-emerald-400' },
    { id: 'notes', label: 'Notes', icon: FileText, color: 'hover:text-amber-400' },
    { id: 'code', label: 'Code Lab', icon: Code2, color: 'hover:text-blue-400' },
    { id: 'study', label: 'Study Hub', icon: GraduationCap, color: 'hover:text-rose-400' },
    { id: 'memory', label: 'AI Memory', icon: Database, color: 'hover:text-teal-400' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'hover:text-slate-300' },
  ];

  return (
    <aside className="hidden md:flex flex-col items-center py-4 px-2.5 z-30 select-none">
      <div className="glass-panel rounded-2xl py-3 px-2 flex flex-col gap-2 shadow-2xl border border-white/[0.08]">
        {dockApps.map((app) => {
          const Icon = app.icon;
          const isActive = activeApp === app.id;

          return (
            <button
              key={app.id}
              onClick={() => openApp(app.id)}
              className={`relative group p-3 rounded-xl transition-all duration-200 flex items-center justify-center ${
                isActive
                  ? 'bg-gradient-to-tr from-cyan-500/20 to-indigo-600/30 text-cyan-300 shadow-md border border-cyan-500/30'
                  : 'text-slate-400 hover:bg-white/[0.07] hover:text-white'
              }`}
            >
              <Icon size={20} className="transition-transform group-hover:scale-110" />

              {/* Active Indicator dot */}
              {isActive && (
                <span className="absolute -left-1 w-1.5 h-3 rounded-r-full bg-cyan-400 shadow-cyan-400/80 shadow-sm" />
              )}

              {/* Floating Tooltip */}
              <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg glass-dropdown text-xs font-medium text-slate-200 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap shadow-xl z-50">
                {app.label}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
