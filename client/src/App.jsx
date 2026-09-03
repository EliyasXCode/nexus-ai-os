import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { OSProvider } from './context/OSContext.jsx';

import { LandingPage } from './pages/LandingPage.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import { DesktopPage } from './pages/DesktopPage.jsx';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-nexus-bg flex items-center justify-center text-cyan-400 font-mono text-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Booting NEXUS AI OS...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  return children;
};

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OSProvider>
          <Routes>
            {/* Public Landing */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth Page */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Authenticated OS Desktop */}
            <Route
              path="/os"
              element={
                <ProtectedRoute>
                  <DesktopPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </OSProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
