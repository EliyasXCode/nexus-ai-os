import React from 'react';

export const NexusCoreOrb = ({ state = 'idle', size = 'md', className = '' }) => {
  // size: 'sm' (24px), 'md' (40px), 'lg' (64px), 'xl' (96px)
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const isThinking = state === 'thinking';
  const isAgentActive = state === 'agent';

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      {/* Outer Glow Halo */}
      <div
        className={`absolute inset-0 rounded-full blur-md transition-all duration-700 ${
          isThinking
            ? 'bg-gradient-to-tr from-cyan-400 to-indigo-600 opacity-80 animate-pulse'
            : isAgentActive
            ? 'bg-gradient-to-tr from-violet-500 to-fuchsia-500 opacity-75'
            : 'bg-gradient-to-tr from-cyan-500/40 to-indigo-500/40 opacity-50'
        }`}
      />

      {/* Orbiting ring when thinking or active */}
      {(isThinking || isAgentActive) && (
        <div className="absolute -inset-1 rounded-full border border-dashed border-cyan-400/60 animate-glow-spin" />
      )}

      {/* Inner Sphere Core */}
      <div
        className={`relative z-10 w-full h-full rounded-full shadow-inner flex items-center justify-center transition-all duration-500 ${
          isThinking
            ? 'bg-gradient-to-br from-cyan-300 via-sky-500 to-indigo-700 shadow-cyan-300/50'
            : isAgentActive
            ? 'bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-600 shadow-purple-400/50'
            : 'bg-gradient-to-br from-sky-400/90 via-indigo-600/90 to-slate-900 shadow-sky-400/30'
        }`}
      >
        {/* Subtle center white specular dot */}
        <div className="w-1/3 h-1/3 rounded-full bg-white/70 blur-[1px]" />
      </div>
    </div>
  );
};
