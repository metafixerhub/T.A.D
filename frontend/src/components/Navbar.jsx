import React, { useState } from 'react';
import { Download, LogIn, Award, Video, HelpCircle, Trophy, FileText, LayoutGrid, Menu, X, Sparkles, BookOpen, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ onLoginClick }) => {
  const [showDownloads, setShowDownloads] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const NavItems = () => (
    <>
      {isHomePage ? (
        <>
          <a href="#about" onClick={() => setIsMobileMenuOpen(false)} style={styles.navLink}>
            About
          </a>
          <a href="#programmes" onClick={() => setIsMobileMenuOpen(false)} style={styles.navLink}>
            Programmes
          </a>
          <a href="#hello-g" onClick={() => setIsMobileMenuOpen(false)} style={{ ...styles.navLink, color: '#c084fc', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={14} /> Hello G
          </a>
          <a href="#why-choose" onClick={() => setIsMobileMenuOpen(false)} style={styles.navLink}>
            Why Choose
          </a>
          <a href="#projects" onClick={() => setIsMobileMenuOpen(false)} style={styles.navLink}>
            Projects
          </a>
          <a href="#certification" onClick={() => setIsMobileMenuOpen(false)} style={styles.navLink}>
            Certification
          </a>
        </>
      ) : (
        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={styles.navLink}>
          Home
        </Link>
      )}

      <Link to="/test/001-haited/-Pre-exams-recommended-by-the-center/14-nov-26" onClick={() => setIsMobileMenuOpen(false)} style={{ ...styles.navLink, color: '#38bdf8', fontWeight: 700 }}>
        Center Test
      </Link>
      <Link to="/notes" onClick={() => setIsMobileMenuOpen(false)} style={styles.navLink}>
        Notes
      </Link>
      <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} style={{ ...styles.navLink, display: 'flex', alignItems: 'center', gap: '6px' }}>
        <LayoutGrid size={15} color="#818cf8" /> Dashboard
      </Link>
      
      {/* Downloads Dropdown */}
      <div 
        style={{ position: 'relative' }} 
        onMouseEnter={() => setShowDownloads(true)}
        onMouseLeave={() => setShowDownloads(false)}
      >
        <div style={styles.downloadToggle}>
          Downloads <ChevronDown size={14} />
        </div>
        
        {showDownloads && (
          <div style={styles.dropdown}>
            <a href="https://antigravity.google/download" target="_blank" rel="noreferrer" style={styles.dropdownItem}>
              <span>Antigravity</span>
              <button style={styles.smallBtn}>Download</button>
            </a>
            <a href="https://www.google.com/chrome/" target="_blank" rel="noreferrer" style={styles.dropdownItem}>
              <span>Chrome Browser</span>
              <button style={styles.smallBtn}>Download</button>
            </a>
            <a href="https://code.visualstudio.com/Download" target="_blank" rel="noreferrer" style={styles.dropdownItem}>
              <span>VS Code</span>
              <button style={styles.smallBtn}>Download</button>
            </a>
          </div>
        )}
      </div>
    </>
  );

  return (
    <nav style={styles.navbar}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={styles.logoContainer}>
          <img 
            src="/logo.png" 
            alt="HAITED" 
            style={styles.logo} 
            onError={(e) => { e.target.style.display = 'none'; }} 
          />
          <div>
            <span style={styles.brandName}>HAITED</span>
            <span style={styles.brandSubtitle}>HIGHER ACADEMY FOR INNOVATION, TECH & DEV</span>
          </div>
        </Link>
        
        {/* Desktop Menu */}
        <div className="nav-links" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <NavItems />
          <button 
            onClick={onLoginClick} 
            style={styles.loginBtn}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <LogIn size={15} /> Student Login
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="show-mobile-flex" style={{ display: 'none', alignItems: 'center', gap: '12px' }}>
          <button onClick={onLoginClick} style={styles.mobileLoginBtn}>
            <LogIn size={15} />
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#f8fafc' }}
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div style={styles.mobileMenu}>
          <NavItems />
          <button onClick={() => { setIsMobileMenuOpen(false); onLoginClick(); }} style={{ ...styles.loginBtn, width: '100%', justifyContent: 'center', marginTop: '10px' }}>
            <LogIn size={16} /> Student Login
          </button>
        </div>
      )}
    </nav>
  );
};

const styles = {
  navbar: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(7, 13, 30, 0.85)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
    padding: '14px 24px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
  },
  logo: {
    height: '42px',
    width: 'auto',
    objectFit: 'contain'
  },
  brandName: {
    display: 'block',
    color: '#ffffff',
    fontSize: '1.25rem',
    fontWeight: 800,
    letterSpacing: '0.04em',
    lineHeight: 1.1,
    background: 'linear-gradient(135deg, #ffffff 0%, #38bdf8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  brandSubtitle: {
    display: 'block',
    fontSize: '0.62rem',
    color: '#64748b',
    fontWeight: 600,
    letterSpacing: '0.04em'
  },
  navLink: {
    color: '#cbd5e1',
    textDecoration: 'none',
    fontSize: '0.88rem',
    fontWeight: 600,
    transition: 'color 0.2s',
    padding: '6px 4px'
  },
  downloadToggle: {
    color: '#cbd5e1',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    fontSize: '0.88rem',
    fontWeight: 600,
    padding: '6px 4px',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    width: '260px',
    background: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '12px',
    padding: '8px 0',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
    zIndex: 150,
  },
  dropdownItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 18px',
    color: '#e2e8f0',
    textDecoration: 'none',
    fontSize: '0.85rem',
    transition: 'background 0.2s',
  },
  smallBtn: {
    background: '#2563eb',
    color: '#ffffff',
    border: 'none',
    padding: '4px 10px',
    fontSize: '0.75rem',
    fontWeight: 600,
    borderRadius: '6px',
    cursor: 'pointer'
  },
  loginBtn: {
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    color: '#ffffff',
    border: 'none',
    padding: '8px 18px',
    borderRadius: '10px',
    fontSize: '0.88rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
    transition: 'all 0.2s'
  },
  mobileLoginBtn: {
    background: '#2563eb',
    color: '#ffffff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  },
  mobileMenu: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    marginTop: '12px',
    paddingTop: '12px',
    gap: '10px'
  }
};

export default Navbar;
