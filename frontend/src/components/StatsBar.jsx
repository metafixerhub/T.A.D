import React from 'react';
import { Users, Video, BookOpen, Code, Clock } from 'lucide-react';

const StatsBar = () => {
  const stats = [
    { icon: <Users size={24} />, count: '2500+', label: 'Students Enrolled' },
    { icon: <Video size={24} />, count: '120+', label: 'Live Classes' },
    { icon: <Video size={24} />, count: '500+', label: 'Recordings' },
    { icon: <BookOpen size={24} />, count: '60+', label: 'E-Books' },
    { icon: <Code size={24} />, count: '100+', label: 'Projects' },
    { icon: <Clock size={24} />, count: '24/7', label: 'Support' },
  ];

  return (
    <section className="container section-padding" style={{ paddingBottom: '20px' }}>
      <div style={{ borderTop: '1px solid rgba(0, 255, 255, 0.2)', borderBottom: '1px solid rgba(0, 255, 255, 0.2)', padding: '30px 0' }}>
        <div className="grid-6" style={{ gap: '20px' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center' }}>
              <div style={{ color: '#00ffff' }}>{s.icon}</div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>{s.count}</h4>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#b0c4de' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
