import React from 'react';
import certificateImg from '../assets/certificate.png';

const Certificate = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px' }}>
      <h2 style={{ color: '#00e676', marginBottom: '30px', fontWeight: 700, letterSpacing: '1px' }}>YOUR CERTIFICATE OF COMPLETION</h2>
      <img 
        src={certificateImg} 
        alt="Certificate" 
        style={{ 
          maxWidth: '100%', 
          height: 'auto', 
          border: '4px solid rgba(0, 255, 255, 0.2)', 
          borderRadius: '12px', 
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)' 
        }} 
      />
    </div>
  );
};

export default Certificate;
