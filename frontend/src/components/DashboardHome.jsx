import React, { useState, useEffect } from 'react';
import { MonitorPlay, HelpCircle, FileText, Trophy, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebaseConfig';

const DashboardHome = () => {
  const navigate = useNavigate();
  const [xp, setXp] = useState(0);

  useEffect(() => {
    const fetchXP = async () => {
      if (auth.currentUser) {
        const userRef = doc(firestore, 'users', auth.currentUser.uid);
        try {
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            setXp(snap.data().xp || 0);
          }
        } catch (err) {
          console.error("Could not fetch XP", err);
        }
      }
    };
    fetchXP();
  }, []);

  const quickLinks = [
    { title: 'Live Session', icon: <MonitorPlay size={20} color="#ef4444" />, path: '/dashboard/live' },
    { title: 'Practice Quiz', icon: <HelpCircle size={20} color="#8b5cf6" />, path: '/dashboard/practice' },
    { title: 'Materials', icon: <FileText size={20} color="#10b981" />, path: '/dashboard/materials' },
    { title: 'Leaderboard', icon: <Trophy size={20} color="#eab308" />, path: '/dashboard/leaderboard' },
    { title: 'Certificate', icon: <Award size={20} color="#2563eb" />, path: '/dashboard/certificate' },
  ];

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
      
      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', borderRadius: '16px', padding: '40px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', marginBottom: '40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-10%', top: '-50%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }}></div>
        <div>
          <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, letterSpacing: '1px' }}>WELCOME BACK</p>
          <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 700 }}>
            {auth.currentUser ? (auth.currentUser.email.split('@')[0]) : 'Student'}
          </h1>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', zIndex: 1, background: 'rgba(255,255,255,0.1)', padding: '15px 30px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)' }}>
          <span style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: 600 }}>Total XP</span>
          <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f59e0b' }}>{xp}</span>
        </div>
      </div>

      {/* Quick Access */}
      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.3rem', color: '#1f2937', marginBottom: '20px' }}>Quick Access</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          {quickLinks.map(link => (
            <div key={link.title} onClick={() => navigate(link.path)} style={{ background: 'white', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', cursor: 'pointer', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                 onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.05)'; }}
                 onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600, color: '#334155' }}>
                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>{link.icon}</div>
                {link.title}
              </div>
              <span style={{ color: '#cbd5e1' }}>›</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default DashboardHome;
