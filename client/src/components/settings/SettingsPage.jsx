import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Badge } from '../common/Badge.jsx';
import { 
  Settings, 
  User, 
  Sparkles, 
  Database, 
  Layers, 
  LogOut, 
  Info, 
  Check, 
  Moon, 
  Sun, 
  Monitor,
  Cpu
} from 'lucide-react';

export const SettingsPage = () => {
  const { user, updateSettings, logout } = useAuth();

  const [settings, setSettings] = useState({
    theme: user?.settings?.theme || 'dark',
    memoryEnabled: user?.settings?.memoryEnabled !== false,
    showAgentActivity: user?.settings?.showAgentActivity !== false,
    responseDetail: user?.settings?.responseDetail || 'balanced',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSettings(settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto h-[calc(100vh-3.5rem)] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2.5 text-white">
            <Settings className="text-slate-300" />
            <span>OS Preferences & Settings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure system themes, AI model preferences, and memory behavior.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs border border-emerald-500/30 animate-in fade-in">
            <Check size={14} />
            <span>Preferences Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 pb-12">
        {/* Account Info */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <User size={16} className="text-cyan-400" />
            <span>User Profile</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Full Name</label>
              <input
                type="text"
                disabled
                value={user?.name || ''}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/5 text-slate-300 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Email Address</label>
              <input
                type="text"
                disabled
                value={user?.email || ''}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/5 text-slate-300 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* AI & Multi-Agent Preferences */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Cpu size={16} className="text-indigo-400" />
            <span>AI Model & Agent System</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <p className="font-medium text-slate-200">Active Intelligence Engine</p>
                <p className="text-slate-400 text-[11px]">Configured dynamically via backend environment</p>
              </div>
              <Badge variant="cyan" size="sm">
                Google Gemini 3.5 Flash
              </Badge>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <p className="font-medium text-slate-200">Long-Term AI Memory</p>
                <p className="text-slate-400 text-[11px]">Allow NEXUS to recall your saved preferences in chat</p>
              </div>
              <input
                type="checkbox"
                checked={settings.memoryEnabled}
                onChange={(e) => setSettings({ ...settings, memoryEnabled: e.target.checked })}
                className="rounded bg-slate-900 border-white/20 text-cyan-500 focus:ring-0 w-4 h-4"
              />
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <p className="font-medium text-slate-200">Show Agent Activity Timeline</p>
                <p className="text-slate-400 text-[11px]">Display real-time routing steps & tool invocations in chat</p>
              </div>
              <input
                type="checkbox"
                checked={settings.showAgentActivity}
                onChange={(e) => setSettings({ ...settings, showAgentActivity: e.target.checked })}
                className="rounded bg-slate-900 border-white/20 text-indigo-500 focus:ring-0 w-4 h-4"
              />
            </div>

            <div>
              <label className="font-medium text-slate-200 block mb-1">Response Detail Level</label>
              <select
                value={settings.responseDetail}
                onChange={(e) => setSettings({ ...settings, responseDetail: e.target.value })}
                className="w-full sm:w-64 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="concise">Concise & Punchy</option>
                <option value="balanced">Balanced (Default)</option>
                <option value="detailed">In-Depth & Comprehensive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            <span>Desktop Theme</span>
          </h2>

          <div className="grid grid-cols-3 gap-3 text-xs">
            {[
              { id: 'dark', label: 'Dark Navy', icon: Moon },
              { id: 'light', label: 'Light (Preview)', icon: Sun },
              { id: 'system', label: 'System Default', icon: Monitor },
            ].map((themeOpt) => {
              const Icon = themeOpt.icon;
              const isSelected = settings.theme === themeOpt.id;
              return (
                <button
                  type="button"
                  key={themeOpt.id}
                  onClick={() => setSettings({ ...settings, theme: themeOpt.id })}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition ${
                    isSelected
                      ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-sm'
                      : 'bg-slate-900/60 text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span>{themeOpt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* System Information / About */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 text-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Info size={18} />
            </div>
            <div>
              <p className="font-semibold text-white">NEXUS AI OS</p>
              <p className="text-slate-400">Version 1.0.0 (Autonomous Agent Architecture)</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs transition"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading ? 'Saving...' : 'Apply Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
};
