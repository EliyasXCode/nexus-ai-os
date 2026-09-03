import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { NexusCoreOrb } from '../common/NexusCoreOrb.jsx';
import { Badge } from '../common/Badge.jsx';
import { 
  Sparkles, 
  Clock, 
  Calendar, 
  Search, 
  User, 
  LogOut, 
  Settings, 
  ChevronDown,
  Cpu
} from 'lucide-react';

export const TopStatusBar = () => {
  const { activeAgentName, systemStatus, setCommandPaletteOpen, openApp } = useOS();
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <header className="h-14 border-b border-white/[0.08] bg-slate-950/70 backdrop-blur-xl px-4 flex items-center justify-between z-40 select-none relative">
      {/* Left: Logo & OS Brand */}
      <div className="flex items-center gap-3">
        <div 
          onClick={() => openApp('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <NexusCoreOrb state={systemStatus === 'thinking' ? 'thinking' : 'idle'} size="sm" />
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold tracking-wider text-sm bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              NEXUS
            </span>
            <span className="text-[11px] font-mono text-cyan-400/80 px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
              AI OS
            </span>
          </div>
        </div>

        {/* Global Command Palette Trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs text-slate-400 transition ml-4"
        >
          <Search size={13} className="text-slate-400" />
          <span>Quick Command</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-black/40 rounded border border-white/10 text-slate-400">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Center: Current Active Agent */}
      <div className="hidden sm:flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-indigo-500/20 shadow-sm">
          <Cpu size={13} className="text-indigo-400 animate-pulse" />
          <span className="text-xs text-slate-400">Active Agent:</span>
          <span className="text-xs font-semibold text-indigo-300">
            {activeAgentName}
          </span>
        </div>
      </div>

      {/* Right: Status, Date, Time & Profile */}
      <div className="flex items-center gap-3">
        {/* Gemini Engine Status */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-[11px]">Gemini 3.5 Flash</span>
        </div>

        {/* Live Date & Time */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-mono pl-2 border-l border-white/10">
          <Calendar size={13} className="text-slate-500" />
          <span>{formattedDate}</span>
          <span className="text-slate-600">•</span>
          <Clock size={13} className="text-slate-500" />
          <span>{formattedTime}</span>
        </div>

        {/* User Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 transition border border-transparent hover:border-white/10"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 glass-dropdown rounded-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-white/10 mb-1">
                <p className="text-xs font-medium text-slate-400">Signed in as</p>
                <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  openApp('settings');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/10 transition text-left"
              >
                <Settings size={14} className="text-slate-400" />
                <span>OS Settings</span>
              </button>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition text-left"
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
