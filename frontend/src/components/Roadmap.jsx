import React from 'react';
import { Lock, Shield, Brain, Terminal, Code, Trophy, BookOpen } from 'lucide-react';

const Roadmap = () => {
  const steps = [
    { icon: <Lock size={24} />, title: 'Foundation &\nCoding Basics', topics: '8+ Topics', date: 'JUN 2025', color: '#00ffff' },
    { icon: <Shield size={24} />, title: 'Cyber Security,\nEncoding & JS', topics: '9+ Topics', date: 'AUG 2025', color: '#00e676' },
    { icon: <Brain size={24} />, title: 'AI & Advanced\nCoding Systems', topics: '9+ Topics', date: 'SEP 2025', color: '#b388ff' },
    { icon: <Terminal size={24} />, title: 'Backend, Termux\n& Projects', topics: '9+ Topics', date: 'OCT 2025', color: '#00ffff' },
    { icon: <Code size={24} />, title: 'Advanced Dev &\nSystem Building', topics: '8+ Topics', date: 'NOV 2025', color: '#00ffff' },
    { icon: <Trophy size={24} />, title: 'Final Exam &\nMastery Program', topics: '10+ Topics', date: 'DEC 2025', color: '#ffd700' },
  ];

  return (
    <section className="container section-padding">
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
        <div style={{ width: '30px', height: '2px', background: '#00e676' }}></div>
        <h3 style={{ margin: 0, color: '#b0c4de', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Our Course Roadmap</h3>
      </div>

      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', overflowX: 'auto', paddingBottom: '20px', gap: '20px', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        {/* Connecting Line */}
        <div style={{ position: 'absolute', top: '75px', left: '80px', right: '80px', height: '1px', borderTop: '1px dashed rgba(0, 255, 255, 0.3)', zIndex: 0 }}></div>

        {steps.map((s, i) => (
          <div key={i} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '160px', gap: '15px' }}>
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: `1px solid ${s.color}60`, padding: '25px 15px', width: '100%', background: 'rgba(0, 20, 40, 0.8)' }}>
              <div style={{ color: s.color, marginBottom: '15px' }}>{s.icon}</div>
              <h5 style={{ margin: 0, fontSize: '0.9rem', whiteSpace: 'pre-line', height: '40px' }}>{s.title}</h5>
              <p style={{ margin: '15px 0 0 0', fontSize: '0.75rem', color: '#b0c4de' }}>{s.topics}</p>
            </div>
            <div style={{ color: s.color, fontSize: '0.8rem', fontWeight: 600, marginTop: '5px' }}>{s.date}</div>
          </div>
        ))}
      </div>

      <div className="flex-center" style={{ marginTop: '40px' }}>
        <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          VIEW FULL SYLLABUS <BookOpen size={18} />
        </button>
      </div>
    </section>
  );
};

export default Roadmap;
