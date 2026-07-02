import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LoginBar from './components/LoginBar';
import Footer from './components/Footer';
import Certificate from './components/Certificate';
import LiveSession from './components/LiveSession';
import Quiz from './components/Quiz';
import Leaderboard from './components/Leaderboard';

function AppContent() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />
      <main className="content-wrapper" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/certificat" element={<Certificate />} />
          <Route path="/live" element={<LiveSession />} />
          <Route path="/practice" element={<Quiz />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
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
