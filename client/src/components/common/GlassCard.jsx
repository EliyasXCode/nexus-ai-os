import React from 'react';

export const GlassCard = ({
  children,
  className = '',
  hover = false,
  onClick = null,
}) => {
  return (
    <div
      onClick={onClick}
      className={`glass-panel rounded-2xl p-5 ${
        hover ? 'glass-panel-hover cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
