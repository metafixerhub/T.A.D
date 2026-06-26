import React from 'react';
import { LogIn } from 'lucide-react';

const Navbar = () => {
  const links = ['HOME', 'COURSES', 'RECORDINGS', 'TEACHERS', 'E-BOOKS', 'PROJECTS', 'BLOG', 'CONTACT'];

  return (
    <nav style={styles.navbar}>
      <div style={styles.logoContainer}>
        <img src="/logo.png" alt="Logo" style={styles.logo} onError={(e) => { e.target.style.display = 'none' }} />
        <span style={styles.brandName}>TRAINING AND<br/><span style={{fontSize:'0.8rem', color:'#b0c4de'}}>DEVELOPMENT</span></span>
      </div>
      
      {/* Hidden on mobile, visible on desktop */}
      <div className="nav-links" style={styles.linksContainer}>
        {links.map((link, i) => (
          <a key={i} href="#" style={{...styles.navLink, color: link === 'HOME' ? '#00ffff' : '#b0c4de'}}>{link}</a>
        ))}
      </div>

      <button className="btn-outline" style={styles.loginButton}>
        <LogIn size={16} /> LOGIN
      </button>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 40px',
    background: 'rgba(0, 15, 30, 0.95)',
    borderBottom: '1px solid rgba(0, 255, 255, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer'
  },
  logo: {
    height: '40px',
    objectFit: 'contain'
  },
  brandName: {
    color: '#1e88e5',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    lineHeight: 1.1
  },
  linksContainer: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  navLink: {
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 500,
    transition: 'color 0.3s ease',
  },
  loginButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 20px',
    fontSize: '0.9rem',
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: '4px'
  }
};

export default Navbar;
