import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LoginBar from './components/LoginBar';
import Footer from './components/Footer';

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />
      <main className="content-wrapper" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <HeroSection />
      </main>
      <Footer />
      <LoginBar isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}

export default App;
