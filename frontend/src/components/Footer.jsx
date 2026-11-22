import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Mail, 
  MapPin, 
  Globe, 
  ExternalLink, 
  Terminal, 
  Sparkles, 
  Award, 
  BookOpen, 
  ArrowUpRight,
  Code
} from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: 'linear-gradient(180deg, #070d1e 0%, #040813 100%)',
      color: '#94a3b8',
      borderTop: '1px solid rgba(59, 130, 246, 0.2)',
      paddingTop: '60px',
      paddingBottom: '30px',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Main Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>
          
          {/* Brand Info Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
              <img 
                src="/logo.png" 
                alt="HAITED Logo" 
                style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div>
                <span style={{ 
                  color: '#ffffff', 
                  fontSize: '1.3rem', 
                  fontWeight: 800, 
                  letterSpacing: '0.05em',
                  background: 'linear-gradient(135deg, #ffffff 0%, #38bdf8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  HAITED
                </span>
                <span style={{ display: 'block', fontSize: '0.68rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.03em' }}>
                  HIGHER ACADEMY FOR INNOVATION, TECH & DEV
                </span>
              </div>
            </Link>

            <p style={{ fontSize: '0.88rem', lineHeight: '1.6', color: '#94a3b8', margin: 0 }}>
              Higher Academy for Innovation, Technology, Education & Development. Dedicated to practical coding, artificial intelligence, and future-ready digital skills.
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'rgba(59, 130, 246, 0.12)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: '#38bdf8',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              width: 'fit-content'
            }}>
              Learn • Build • Grow • Achieve
            </div>
          </div>

          {/* Programmes Column */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={16} color="#38bdf8" /> Learning Programmes
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
              <li>
                <a href="#programmes" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#38bdf8'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
                  Advance Coding Master (Python & Web)
                </a>
              </li>
              <li>
                <a href="#programmes" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#38bdf8'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
                  Digital Systems Developer (Full-Stack)
                </a>
              </li>
              <li>
                <a href="#programmes" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#38bdf8'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
                  AI & Future Technology Master
                </a>
              </li>
              <li>
                <a href="#hello-g" style={{ color: '#c084fc', textDecoration: 'none', fontWeight: 600 }}>
                  ✨ Hello G AI Teaching Assistant
                </a>
              </li>
            </ul>
          </div>

          {/* Learning Resources Column */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={16} color="#fbbf24" /> Learning Resources
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
              <li>
                <Link to="/test/001-haited/-Pre-exams-recommended-by-the-center/14-nov-26" style={{ color: '#94a3b8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }} onMouseEnter={(e) => e.currentTarget.style.color = '#38bdf8'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
                  Center Assessment Portal <ArrowUpRight size={13} />
                </Link>
              </li>
              <li>
                <Link to="/notes" style={{ color: '#94a3b8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }} onMouseEnter={(e) => e.currentTarget.style.color = '#38bdf8'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
                  Notes & Study Materials <ArrowUpRight size={13} />
                </Link>
              </li>
              <li>
                <Link to="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }} onMouseEnter={(e) => e.currentTarget.style.color = '#38bdf8'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
                  Student Dashboard <ArrowUpRight size={13} />
                </Link>
              </li>
              <li>
                <Link to="/test/admin" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.82rem' }}>
                  Center Admin Evaluation Records
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Official Website Column */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={16} color="#10b981" /> Official Portal
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={15} color="#38bdf8" />
                <a href="https://www.mfho.in" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}>
                  www.mfho.in
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={15} color="#94a3b8" />
                <span>support@mfho.in</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={15} color="#10b981" />
                <span>Verified Center Standards</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Legal & Disclaimers */}
        <div style={{
          paddingTop: '25px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '0.82rem',
          color: '#64748b'
        }}>
          <div>
            © {new Date().getFullYear()} <strong>HAITED</strong> (Higher Academy for Innovation, Technology, Education & Development). All rights reserved.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#94a3b8'} onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>
              Privacy Policy
            </span>
            <span>•</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#94a3b8'} onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>
              Terms & Conditions
            </span>
            <span>•</span>
            <a href="https://www.mfho.in" target="_blank" rel="noreferrer" style={{ color: '#64748b', textDecoration: 'none' }} onMouseEnter={(e) => e.currentTarget.style.color = '#38bdf8'} onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>
              mfho.in
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;