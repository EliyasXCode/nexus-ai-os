import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const variantStyles = {
    default: 'bg-slate-800/80 text-slate-300 border-slate-700/50',
    primary: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    cyan: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    rose: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    purple: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    high: 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-medium',
    medium: 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-medium',
    low: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-medium',
    ai: 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border-cyan-500/40 font-semibold',
  };

  const sizeStyles = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border backdrop-blur-sm transition-all ${
        variantStyles[variant] || variantStyles.default
      } ${sizeStyles[size] || sizeStyles.sm} ${className}`}
    >
      {children}
    </span>
  );
};
