import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import CyberBackground from './components/CyberBackground';
import HeroSection from './components/HeroSection';
import LoginBar from './components/LoginBar';
import FeaturesGrid from './components/FeaturesGrid';
import Roadmap from './components/Roadmap';
import TeachersSection from './components/TeachersSection';
import StatsBar from './components/StatsBar';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <CyberBackground />
      <Navbar />
      
      <main className="content-wrapper">
        <HeroSection />
        <LoginBar />
        <FeaturesGrid />
        <Roadmap />
        <TeachersSection />
        <StatsBar />
        <Footer />
      </main>
    </>
  );
}

export default App;
