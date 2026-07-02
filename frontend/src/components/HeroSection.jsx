import React from 'react';
import { Shield } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="container section-padding" style={{ paddingTop: '80px', paddingBottom: '120px', textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(37, 99, 235, 0.1)', border: '1px solid #2563eb', color: '#2563eb', padding: '6px 12px', borderRadius: '20px', marginBottom: '24px', fontSize: '0.85rem', fontWeight: 600 }}>
        <Shield size={16} /> SECURE THE FUTURE
      </div>
      <h1 className="hero-title">
        ᴍᴀꜱᴛᴇʀ ᴄʏʙᴇʀ ꜱᴇᴄᴜʀɪᴛʏ & <span className="text-cyan">ᴄᴏᴅɪɴɢ ꜱʏꜱᴛᴇᴍꜱ</span>
      </h1>
      <p style={{ color: '#4b5563', fontSize: '1.2rem', margin: '0 auto 40px auto', maxWidth: '600px' }}>
        Access all course materials, premium recordings, and interactive live sessions from our secure portal.
      </p>
    </section>
  );
};

export default HeroSection;
