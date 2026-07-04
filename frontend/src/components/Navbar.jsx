import React, { useState } from 'react';
import { Download, LogIn, Award, Video, HelpCircle, Trophy, FileText, LayoutGrid, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ onLoginClick }) => {
  const [showDownloads, setShowDownloads] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavItems = () => (
    <>
      <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6366f1', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', padding: '10px 0' }}>
        <LayoutGrid size={16} /> Dashboard
      </Link>
      <Link to="/live" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', padding: '10px 0' }}>
        <Video size={16} /> Live Session
      </Link>
      <Link to="/practice" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8b5cf6', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', padding: '10px 0' }}>
        <HelpCircle size={16} /> Practice
      </Link>
      <Link to="/leaderboard" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#eab308', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', padding: '10px 0' }}>
        <Trophy size={16} /> Leaderboard
      </Link>
      <Link to="/materials" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', padding: '10px 0' }}>
        <FileText size={16} /> Materials
      </Link>
      
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
    </>
  );

  return (
    <nav className="glass-nav" style={{ ...styles.navbar, position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Link to="/" style={styles.logoContainer}>
          <img src="/logo.png" alt="Logo" style={styles.logo} onError={(e) => { e.target.style.display = 'none' }} />
          <span style={styles.brandName}>TRAINING AND<br/><span style={{fontSize:'0.8rem', color:'#6b7280'}}>DEVELOPMENT</span></span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="nav-links" style={{ gap: '20px', alignItems: 'center' }}>
          <NavItems />
          <button onClick={onLoginClick} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '4px' }}>
            <LogIn size={16} /> LOGIN
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="show-mobile-flex" style={{ alignItems: 'center', gap: '15px' }}>
          <button onClick={onLoginClick} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '4px' }}>
            <LogIn size={16} />
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
            {isMobileMenuOpen ? <X size={28} color="#1f2937" /> : <Menu size={28} color="#1f2937" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="show-mobile-flex" style={{ flexDirection: 'column', width: '100%', borderTop: '1px solid #e5e7eb', marginTop: '15px', paddingTop: '15px', gap: '5px' }}>
          <NavItems />
        </div>
      )}
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
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
    left: 0,
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
