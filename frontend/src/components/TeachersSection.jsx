import React from 'react';
import { Lock } from 'lucide-react';
import { LinkedinIcon as Linkedin, GithubIcon as Github, YoutubeIcon as Youtube } from './icons';

const TeachersSection = () => {
  return (
    <section className="container section-padding">
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
        <div style={{ width: '30px', height: '2px', background: '#00e676' }}></div>
        <h3 style={{ margin: 0, color: '#b0c4de', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Meet Your Teachers</h3>
      </div>

      <div className="grid-3">
        {/* Teacher 1 */}
        <div className="glass-card" style={{ display: 'flex', gap: '20px', padding: '20px', background: 'rgba(0, 20, 40, 0.8)' }}>
          <div style={{ width: '120px', height: '140px', background: '#002244', borderRadius: '8px', overflow: 'hidden' }}>
             {/* Placeholder for teacher image */}
             <div style={{ width: '100%', height: '100%', background: 'linear-gradient(to bottom, #004488, #001122)' }}></div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Subhang</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#b0c4de', marginBottom: '15px' }}>Web Development Expert</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#88a0c0', lineHeight: 1.6, flexGrow: 1 }}>
              Expert in modern web technologies, UI/UX frameworks & real-world development.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}><Linkedin size={14} color="#00ffff" /></div>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}><Github size={14} color="#00ffff" /></div>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}><Youtube size={14} color="#ff0000" /></div>
            </div>
          </div>
        </div>

        {/* Teacher 2 */}
        <div className="glass-card" style={{ display: 'flex', gap: '20px', padding: '20px', background: 'rgba(0, 20, 40, 0.8)' }}>
          <div style={{ width: '120px', height: '140px', background: '#002244', borderRadius: '8px', overflow: 'hidden' }}>
             {/* Placeholder for teacher image */}
             <div style={{ width: '100%', height: '100%', background: 'linear-gradient(to bottom, #004444, #001111)' }}></div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Subhang</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#00ffff', marginBottom: '15px' }}>Programming & Coding Instructor</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#88a0c0', lineHeight: 1.6, flexGrow: 1 }}>
              Specialized in programming concepts, problem solving, algorithms & software development.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}><Linkedin size={14} color="#00ffff" /></div>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}><Github size={14} color="#00ffff" /></div>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}><Youtube size={14} color="#ff0000" /></div>
            </div>
          </div>
        </div>

        {/* Learn Anywhere Banner */}
        <div className="glass-card" style={{ position: 'relative', overflow: 'hidden', border: '1px solid rgba(30, 136, 229, 0.5)', padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(0, 30, 60, 0.9), rgba(0, 10, 20, 0.9))' }}>
          {/* Laptop Mockup Graphic */}
          <div style={{ position: 'absolute', right: '-30px', top: '30px', width: '200px', height: '120px', border: '2px solid rgba(0, 255, 255, 0.3)', borderRadius: '8px', transform: 'perspective(500px) rotateY(-20deg)', boxShadow: '0 0 20px rgba(0, 255, 255, 0.1)' }}>
             <div className="flex-center" style={{ width: '100%', height: '100%', background: 'rgba(0, 20, 40, 0.5)' }}><Lock color="#00ffff" /></div>
          </div>
          
          <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#1e88e5', marginBottom: '15px', position: 'relative', zIndex: 2 }}>LEARN ANYTIME,<br />ANYWHERE</h4>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#b0c4de', marginBottom: '25px', position: 'relative', zIndex: 2, maxWidth: '60%' }}>
            Access our platform on any device and continue your learning.
          </p>
          <button className="btn-outline" style={{ width: 'fit-content', padding: '8px 20px', fontSize: '0.85rem', borderColor: '#1e88e5', color: '#1e88e5' }}>GET STARTED</button>
        </div>
      </div>
    </section>
  );
};

export default TeachersSection;
