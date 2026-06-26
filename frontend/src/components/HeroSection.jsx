import React from 'react';
import { Shield, Users, BookOpen, Briefcase, Award, Code } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="container section-padding" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      <div className="grid-2">
        {/* Left Content */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 230, 118, 0.1)', border: '1px solid #00e676', color: '#00e676', padding: '6px 12px', borderRadius: '20px', width: 'fit-content', marginBottom: '24px', fontSize: '0.85rem', fontWeight: 600 }}>
            <Shield size={16} /> CYBER SECURITY COURSE
          </div>
          <h1 style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px' }}>
            LEARN. <span className="text-green">DEFEND.</span><br />
            <span className="text-cyan">SECURE THE FUTURE.</span>
          </h1>
          <p style={{ color: '#b0c4de', fontSize: '1.2rem', marginBottom: '40px', maxWidth: '500px' }}>
            Master Cyber Security, Ethical Hacking, AI Integration & Advanced Coding Systems with real-world projects.
          </p>
          
          {/* Features small grid */}
          <div className="grid-4" style={{ marginBottom: '40px', maxWidth: '500px' }}>
            <FeatureIcon icon={<Users size={24} />} text="Expert Teachers" />
            <FeatureIcon icon={<Code size={24} />} text="Practical Learning" />
            <FeatureIcon icon={<Briefcase size={24} />} text="Real World Projects" />
            <FeatureIcon icon={<Award size={24} />} text="Certificate Program" />
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              EXPLORE COURSES <span style={{ fontSize: '1.2rem' }}>→</span>
            </button>
            <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              VIEW SYLLABUS <BookOpen size={18} />
            </button>
          </div>
        </div>

        {/* Right Content - Instructor Images Placeholder */}
        <div style={{ position: 'relative', minHeight: '500px', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
          {/* Shield Background graphic placeholder */}
          <div style={{ position: 'absolute', top: '10%', right: '10%', width: '300px', height: '350px', border: '2px solid rgba(0, 255, 255, 0.2)', borderRadius: '20px', transform: 'rotate(10deg)', zIndex: 0, boxShadow: '0 0 50px rgba(0, 255, 255, 0.1)' }}></div>
          
          {/* Instructor 1 */}
          <div style={{ position: 'absolute', left: '10%', bottom: '0', zIndex: 2 }}>
             <div style={{ width: '240px', height: '380px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,30,60,0.5))', borderRadius: '12px', display: 'flex', alignItems: 'flex-end', border: '1px solid rgba(0, 255, 255, 0.3)' }}>
                <div style={{ background: 'rgba(0, 30, 60, 0.8)', backdropFilter: 'blur(10px)', padding: '15px', width: '100%', borderRadius: '0 0 12px 12px', borderTop: '1px solid rgba(0, 255, 255, 0.3)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ background: '#00e676', padding: '8px', borderRadius: '50%', color: '#000' }}><Code size={20} /></div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>SUBHANG</h4>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#00e676' }}>WEB DEVELOPMENT EXPERT</p>
                  </div>
                </div>
             </div>
          </div>
          
          {/* Instructor 2 */}
          <div style={{ position: 'absolute', right: '0', bottom: '0', zIndex: 1 }}>
             <div style={{ width: '240px', height: '420px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(60,30,0,0.5))', borderRadius: '12px', display: 'flex', alignItems: 'flex-end', border: '1px solid rgba(255, 165, 0, 0.3)' }}>
                <div style={{ background: 'rgba(60, 30, 0, 0.8)', backdropFilter: 'blur(10px)', padding: '15px', width: '100%', borderRadius: '0 0 12px 12px', borderTop: '1px solid rgba(255, 165, 0, 0.3)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ background: '#ffa500', padding: '8px', borderRadius: '50%', color: '#000' }}><Code size={20} /></div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>SUBHANG</h4>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#ffa500' }}>PROGRAMMING INSTRUCTOR</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureIcon = ({ icon, text }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center' }}>
    <div style={{ color: '#00ffff' }}>{icon}</div>
    <span style={{ fontSize: '0.8rem', color: '#b0c4de' }}>{text}</span>
  </div>
);

export default HeroSection;
