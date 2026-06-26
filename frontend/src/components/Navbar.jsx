import React from 'react';
import { LogIn, Video, Users } from 'lucide-react';

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logoContainer}>
        <img src="/logo.png" alt="Logo" style={{...styles.logo}} onError={(e) => { e.target.style.display = 'none' }} />
        <span style={styles.brandName}>CyberLearn</span>
      </div>
      <div style={styles.linksContainer}>
        <button className="nav-btn" style={styles.navButton}>
          <Users size={18} />
          Teachers
        </button>
        <button className="nav-btn" style={styles.navButton}>
          <Video size={18} />
          Recordings
        </button>
        <button className="nav-btn login-btn" style={{ ...styles.navButton, ...styles.loginButton }}>
          <LogIn size={18} />
          Login
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
    padding: '15px 40px',
    background: 'rgba(0, 20, 20, 0.6)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(0, 255, 255, 0.2)',
    boxShadow: '0 4px 30px rgba(0, 255, 255, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    cursor: 'pointer'
  },
  logo: {
    height: '40px',
    objectFit: 'contain',
    filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.8))'
  },
  brandName: {
    color: '#00ffff',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    letterSpacing: '2px',
    textShadow: '0 0 10px rgba(0, 255, 255, 0.6)'
  },
  linksContainer: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'transparent',
    color: '#e0e0e0',
    border: '1px solid transparent',
    padding: '8px 16px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    borderRadius: '4px',
    fontWeight: '500'
  },
  loginButton: {
    border: '1px solid rgba(0, 255, 255, 0.5)',
    color: '#00ffff',
    boxShadow: '0 0 10px rgba(0, 255, 255, 0.1) inset'
  }
};

export default Navbar;
