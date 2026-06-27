import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LoginBar from './components/LoginBar';
import Footer from './components/Footer';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main className="content-wrapper" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <HeroSection />
        <LoginBar />
      </main>
      <Footer />
    </div>
  );
}

export default App;
