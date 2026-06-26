import React from 'react';
import Navbar from './components/Navbar';
import CyberBackground from './components/CyberBackground';

function App() {
  return (
    <>
      <CyberBackground />
      <Navbar />
      
      <main className="content-wrapper">
        <h1 className="hero-title">Master the Digital Realm</h1>
        <p className="hero-subtitle">
          Join elite instructors. Access classified recordings. 
          Elevate your skills in cybersecurity, development, and beyond.
        </p>
        <button className="cta-btn">Start Learning</button>
      </main>
    </>
  );
}

export default App;
