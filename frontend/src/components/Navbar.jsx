import React from 'react';

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logoContainer}>
        <img src="/logo.png" alt="Logo" style={styles.logo} onError={(e) => { e.target.style.display = 'none' }} />
        <span style={styles.brandName}>TRAINING AND<br/><span style={{fontSize:'0.8rem', color:'#b0c4de'}}>DEVELOPMENT</span></span>
      </div>
      <a href="mailto:contact@training.com" style={styles.contactLink}>Contact Support</a>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    background: 'transparent',
    borderBottom: '1px solid rgba(0, 255, 255, 0.1)',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
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
  contactLink: {
    color: '#00ffff',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 600
  }
};

export default Navbar;
