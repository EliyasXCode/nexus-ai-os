import React, { createContext, useContext, useState, useEffect } from 'react';

const OSContext = createContext(null);

export const OSProvider = ({ children }) => {
  const [activeApp, setActiveApp] = useState('home');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [activeAgentName, setActiveAgentName] = useState('NEXUS Central');
  const [systemStatus, setSystemStatus] = useState('online'); // 'online' | 'thinking' | 'idle'
  const [pendingPrompt, setPendingPrompt] = useState(null);

  // Global keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openApp = (appName, promptToSubmit = null) => {
    setActiveApp(appName);
    if (promptToSubmit) {
      setPendingPrompt(promptToSubmit);
    }
  };

  const clearPendingPrompt = () => {
    setPendingPrompt(null);
  };

  return (
    <OSContext.Provider
      value={{
        activeApp,
        setActiveApp,
        openApp,
        commandPaletteOpen,
        setCommandPaletteOpen,
        activeAgentName,
        setActiveAgentName,
        systemStatus,
        setSystemStatus,
        pendingPrompt,
        clearPendingPrompt,
      }}
    >
      {children}
    </OSContext.Provider>
  );
};

export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) {
    throw new Error('useOS must be used within an OSProvider');
  }
  return context;
};
