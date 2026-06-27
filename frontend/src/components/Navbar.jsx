import React, { useState } from 'react';
import { Download } from 'lucide-react';

const Navbar = () => {
  const [showDownloads, setShowDownloads] = useState(false);

  return (
    <nav style={styles.navbar}>
      <div style={styles.logoContainer}>
        <img src="/logo.png" alt="Logo" style={styles.logo} onError={(e) => { e.target.style.display = 'none' }} />
        <span style={styles.brandName}>TRAINING AND<br/><span style={{fontSize:'0.8rem', color:'#b0c4de'}}>DEVELOPMENT</span></span>
      </div>
      
      <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
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

        <a href="mailto:contact@training.com" style={styles.contactLink}>Contact Support</a>
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
  },
  downloadToggle: {
    color: '#fff',
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
    background: 'rgba(0, 15, 30, 0.95)',
    border: '1px solid rgba(0, 255, 255, 0.2)',
    borderRadius: '8px',
    padding: '10px 0',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    zIndex: 50,
  },
  dropdownItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    color: '#b0c4de',
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
