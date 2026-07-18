import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LoginBar from './components/LoginBar';
import Footer from './components/Footer';
import Certificate from './components/Certificate';
import LiveSession from './components/LiveSession';
import DNA from './components/DNA';
import Leaderboard from './components/Leaderboard';
import Dashboard from './components/Dashboard';
import Project from './components/Project';
import AdminPanel from './components/AdminPanel';
import StoryCorner from './components/StoryCorner';

import DashboardHome from './components/DashboardHome';

function AppContent() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  if (isDashboard) {
    return (
      <>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="admin" element={<AdminPanel />} />
            <Route path="story-corner" element={<StoryCorner />} />
            <Route path="live" element={<LiveSession />} />
            <Route path="dna" element={<DNA />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="project" element={<Project />} />
            <Route path="certificate" element={<Certificate />} />
          </Route>
        </Routes>
        <LoginBar isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      </>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />
      <main className="content-wrapper" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Routes>
          <Route path="/" element={<HeroSection />} />
        </Routes>
      </main>
      <Footer />
      <LoginBar isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
