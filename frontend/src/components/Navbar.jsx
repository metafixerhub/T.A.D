import React, { useState } from 'react';
import { Download, LogIn, Award, Video, HelpCircle, Trophy, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ onLoginClick }) => {
  const [showDownloads, setShowDownloads] = useState(false);

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.logoContainer}>
        <img src="/logo.png" alt="Logo" style={styles.logo} onError={(e) => { e.target.style.display = 'none' }} />
        <span style={styles.brandName}>TRAINING AND<br/><span style={{fontSize:'0.8rem', color:'#6b7280'}}>DEVELOPMENT</span></span>
      </Link>
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        
        {/* Live Session Link */}
        <Link to="/live" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
          <Video size={16} /> Live Session
        </Link>

        {/* Practice Link */}
        <Link to="/practice" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8b5cf6', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
          <HelpCircle size={16} /> Practice
        </Link>

        {/* Leaderboard Link */}
        <Link to="/leaderboard" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#eab308', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
          <Trophy size={16} /> Leaderboard
        </Link>

        {/* Materials Link */}
        <Link to="/materials" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
          <FileText size={16} /> Materials
        </Link>

        {/* Certificate Link */}
        <Link to="/certificat" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563eb', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
          <Award size={16} /> Certificate
        </Link>

        {/* Downloads Dropdown */}
        <div 
          style={{ position: 'relative' }} 
          onMouseEnter={() => setShowDownloads(true)}
          onMouseLeave={() => setShowDownloads(false)}
        >
          <div style={styles.downloadToggle}>
            Downloads <Download size={16} />
          </div>
          
          {showDownloads && (
            <div style={styles.dropdown}>
              <a href="https://antigravity.google/download" target="_blank" rel="noreferrer" style={styles.dropdownItem}>
                <span>Antigravity</span>
                <button className="btn-primary" style={styles.smallBtn}>Download</button>
              </a>
              <a href="https://www.google.com/chrome/" target="_blank" rel="noreferrer" style={styles.dropdownItem}>
                <span>Chrome Browser</span>
                <button className="btn-primary" style={styles.smallBtn}>Download</button>
              </a>
              <a href="https://code.visualstudio.com/Download" target="_blank" rel="noreferrer" style={styles.dropdownItem}>
                <span>VS Code</span>
                <button className="btn-primary" style={styles.smallBtn}>Download</button>
              </a>
            </div>
          )}
        </div>

        <button onClick={onLoginClick} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '4px' }}>
          <LogIn size={16} /> LOGIN
        </button>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    background: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
  },
  logo: {
    height: '40px',
    objectFit: 'contain'
  },
  brandName: {
    color: '#1f2937',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    lineHeight: 1.1
  },
  downloadToggle: {
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 600,
    padding: '10px 0',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    width: '280px',
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '10px 0',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    zIndex: 50,
  },
  dropdownItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    color: '#4b5563',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'background 0.2s ease',
  },
  smallBtn: {
    padding: '6px 12px',
    fontSize: '0.75rem',
    borderRadius: '4px',
  }
};

export default Navbar;
