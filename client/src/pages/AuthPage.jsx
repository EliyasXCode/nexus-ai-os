import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { NexusCoreOrb } from '../components/common/NexusCoreOrb.jsx';
import { Lock, Mail, User, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();

  const [isRegister, setIsRegister] = useState(searchParams.get('mode') === 'register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/os');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) throw new Error('Please provide your name');
        await register(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
      navigate('/os');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nexus-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Container */}
      <div className="relative z-10 w-full max-w-md glass-dropdown rounded-3xl p-8 border border-white/10 shadow-2xl">
        {/* Logo and Brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <NexusCoreOrb size="md" state="idle" className="mb-3" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            NEXUS AI OS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isRegister ? 'Initialize your personal AI operating system account' : 'Authenticate to access your AI desktop'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-xl bg-slate-900/80 border border-white/10 mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setError('');
            }}
            className={`flex-1 py-2 rounded-lg transition ${
              !isRegister ? 'bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setError('');
            }}
            className={`flex-1 py-2 rounded-lg transition ${
              isRegister ? 'bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Eliyas Mulla"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Email Address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-cyan-500/25 hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{isRegister ? 'Create NEXUS Account' : 'Authenticate Session'}</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-[11px] text-slate-400 hover:text-cyan-300 transition">
            ← Return to Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
};
