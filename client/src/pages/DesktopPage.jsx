import React from 'react';
import { useOS } from '../context/OSContext.jsx';
import { TopStatusBar } from '../components/layout/TopStatusBar.jsx';
import { LeftDock } from '../components/layout/LeftDock.jsx';
import { MobileNav } from '../components/layout/MobileNav.jsx';
import { CommandPalette } from '../components/layout/CommandPalette.jsx';

import { HomeDashboard } from '../components/home/HomeDashboard.jsx';
import { ChatWindow } from '../components/chat/ChatWindow.jsx';
import { TaskManager } from '../components/tasks/TaskManager.jsx';
import { NotesGrid } from '../components/notes/NotesGrid.jsx';
import { CodeWorkspace } from '../components/code/CodeWorkspace.jsx';
import { StudyWorkspace } from '../components/study/StudyWorkspace.jsx';
import { MemoryManager } from '../components/memory/MemoryManager.jsx';
import { AgentsOverview } from '../components/agents/AgentsOverview.jsx';
import { SettingsPage } from '../components/settings/SettingsPage.jsx';

export const DesktopPage = () => {
  const { activeApp } = useOS();

  const renderActiveWorkspace = () => {
    switch (activeApp) {
      case 'home':
        return <HomeDashboard />;
      case 'chat':
        return <ChatWindow />;
      case 'tasks':
        return <TaskManager />;
      case 'notes':
        return <NotesGrid />;
      case 'code':
        return <CodeWorkspace />;
      case 'study':
        return <StudyWorkspace />;
      case 'memory':
        return <MemoryManager />;
      case 'agents':
        return <AgentsOverview />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomeDashboard />;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-nexus-bg text-slate-100 overflow-hidden select-none">
      {/* OS Top Status Bar */}
      <TopStatusBar />

      {/* Main OS Body: Left Dock + Active Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Floating OS Dock */}
        <LeftDock />

        {/* Dynamic Center Workspace */}
        <main className="flex-1 overflow-hidden relative pb-16 md:pb-0">
          {renderActiveWorkspace()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette />
    </div>
  );
};
