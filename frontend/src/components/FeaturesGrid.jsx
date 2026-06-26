import React from 'react';
import { Play, Video, BookOpen, Code, Award, Headset } from 'lucide-react';

const FeaturesGrid = () => {
  const features = [
    { icon: <Play size={32} />, title: 'Live Classes', desc: 'Interactive live sessions with experts.', link: 'VIEW SCHEDULE →', color: '#00ffff' },
    { icon: <Video size={32} />, title: 'Recordings', desc: 'Access all class recordings anytime.', link: 'LOGIN TO ACCESS →', color: '#b388ff' },
    { icon: <BookOpen size={32} />, title: 'E-Books', desc: 'Download study materials & guides.', link: 'EXPLORE E-BOOKS →', color: '#00ffff' },
    { icon: <Code size={32} />, title: 'Projects', desc: 'Build real-world projects step by step.', link: 'VIEW PROJECTS →', color: '#1e88e5' },
    { icon: <Award size={32} />, title: 'Certificates', desc: 'Earn certificates after completion.', link: 'LEARN MORE →', color: '#00ffff' },
    { icon: <Headset size={32} />, title: 'Support', desc: 'Get help from our support team.', link: 'GET SUPPORT →', color: '#00ffff' },
  ];

  return (
    <section className="container section-padding">
      <div className="grid-6">
        {features.map((f, i) => (
          <div key={i} className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '15px', padding: '30px 20px', border: `1px solid ${f.color}40` }}>
            <div style={{ color: f.color }}>
              {f.icon}
            </div>
            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{f.title}</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#b0c4de' }}>{f.desc}</p>
            <a href="#" style={{ color: f.color, fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', marginTop: 'auto', paddingTop: '10px' }}>{f.link}</a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesGrid;
