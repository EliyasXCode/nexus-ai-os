import React, { useState } from 'react';
import { useOS } from '../../context/OSContext.jsx';
import { 
  Home, 
  Bot, 
  CheckSquare, 
  FileText, 
  MoreHorizontal,
  Code2,
  GraduationCap,
  Database,
  Settings,
  X
} from 'lucide-react';

export const MobileNav = () => {
  const { activeApp, openApp } = useOS();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const mainApps = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chat', label: 'AI Chat', icon: Bot },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'notes', label: 'Notes', icon: FileText },
  ];

  const secondaryApps = [
    { id: 'code', label: 'Code Lab', icon: Code2 },
    { id: 'study', label: 'Study Hub', icon: GraduationCap },
    { id: 'memory', label: 'AI Memory', icon: Database },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Drawer for More apps */}
      {moreMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end p-4">
          <div className="glass-dropdown rounded-3xl p-5 border border-white/10 mb-16 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <span className="text-sm font-semibold text-slate-200">More Workspaces</span>
              <button onClick={() => setMoreMenuOpen(false)} className="p-1 rounded-lg text-slate-400">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {secondaryApps.map((app) => {
                const Icon = app.icon;
                return (
                  <button
                    key={app.id}
                    onClick={() => {
                      openApp(app.id);
                      setMoreMenuOpen(false);
                    }}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 text-sm font-medium transition"
                  >
                    <Icon size={18} className="text-cyan-400" />
                    <span>{app.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-950/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-around px-2 z-40">
        {mainApps.map((app) => {
          const Icon = app.icon;
          const isActive = activeApp === app.id;
          return (
            <button
              key={app.id}
              onClick={() => {
                openApp(app.id);
                setMoreMenuOpen(false);
              }}
              className={`flex flex-col items-center gap-1 p-1 transition ${
                isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px]">{app.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setMoreMenuOpen(!moreMenuOpen)}
          className={`flex flex-col items-center gap-1 p-1 transition ${
            moreMenuOpen ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MoreHorizontal size={20} />
          <span className="text-[10px]">More</span>
        </button>
      </nav>
    </>
  );
};
