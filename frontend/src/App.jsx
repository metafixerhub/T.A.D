import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import CyberBackground from './components/CyberBackground';
import { fetchTeachers } from './api';

function App() {
  const [serverStatus, setServerStatus] = useState("Connecting to backend...");

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const teachers = await fetchTeachers();
        if (teachers && teachers.length > 0) {
          setServerStatus("Connected to Render Backend 🟢");
        } else {
          setServerStatus("Connected to Render Backend 🟡");
        }
      } catch (err) {
        setServerStatus("Backend Offline 🔴");
      }
    };
    checkConnection();
  }, []);

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
        <div style={{ color: '#00ffff', marginBottom: '20px', fontSize: '0.9rem', opacity: 0.8, letterSpacing: '1px' }}>
          System Status: {serverStatus}
        </div>
        <button className="cta-btn">Start Learning</button>
      </main>
    </>
  );
}

export default App;
