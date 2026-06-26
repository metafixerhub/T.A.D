import React from 'react';
import { FacebookIcon as Facebook, TwitterIcon as Twitter, InstagramIcon as Instagram, YoutubeIcon as Youtube, LinkedinIcon as Linkedin } from './icons';

const Footer = () => {
  return (
    <footer className="container section-padding" style={{ paddingBottom: '30px' }}>
      <div className="grid-4" style={{ paddingBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        {/* Brand & Socials */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <img src="/logo.png" alt="Logo" style={{ height: '40px' }} onError={(e) => e.target.style.display = 'none'} />
            <h4 style={{ margin: 0, color: '#1e88e5', fontSize: '1.2rem', lineHeight: 1.1 }}>TRAINING AND<br/><span style={{ color: '#b0c4de', fontSize: '1rem' }}>DEVELOPMENT</span></h4>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#b0c4de', marginBottom: '20px', lineHeight: 1.6 }}>
            Empowering the next generation of developers & security experts with industry-relevant skills.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <SocialIcon icon={<Facebook size={16} />} />
            <SocialIcon icon={<Twitter size={16} />} />
            <SocialIcon icon={<Instagram size={16} />} />
            <SocialIcon icon={<Youtube size={16} />} />
            <SocialIcon icon={<Linkedin size={16} />} />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '20px' }}>QUICK LINKS</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <FooterLink text="Home" />
            <FooterLink text="Courses" />
            <FooterLink text="Recordings" />
            <FooterLink text="E-Books" />
            <FooterLink text="Projects" />
            <FooterLink text="Teachers" />
            <FooterLink text="Blog" />
            <FooterLink text="Contact" />
          </div>
        </div>

        {/* Resources */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '20px' }}>RESOURCES</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <FooterLink text="Syllabus" />
            <FooterLink text="Study Materials" />
            <FooterLink text="FAQ" />
            <FooterLink text="Privacy Policy" />
            <FooterLink text="Terms & Conditions" />
            <FooterLink text="Refund Policy" />
          </div>
        </div>

        {/* Subscribe */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '20px' }}>STAY UPDATED</h4>
          <p style={{ fontSize: '0.85rem', color: '#b0c4de', marginBottom: '15px' }}>
            Subscribe to get latest updates, offers and new course alerts.
          </p>
          <div style={{ display: 'flex' }}>
            <input type="email" placeholder="Enter your email" style={{ padding: '10px 15px', borderRadius: '4px 0 0 4px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', color: 'white', flex: 1, width: '100%', outline: 'none' }} />
            <button className="btn-primary" style={{ borderRadius: '0 4px 4px 0', padding: '10px 20px' }}>SUBSCRIBE</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#88a0c0' }}>© 2026 Training and Development. All Rights Reserved.</p>
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href="#" style={{ color: '#88a0c0', fontSize: '0.8rem', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ color: '#88a0c0', fontSize: '0.8rem', textDecoration: 'none' }}>Terms & Conditions</a>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon }) => (
  <a href="#" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', color: '#b0c4de', transition: 'all 0.3s ease' }}>
    {icon}
  </a>
);

const FooterLink = ({ text }) => (
  <a href="#" style={{ color: '#b0c4de', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.3s ease' }}>{text}</a>
);

export default Footer;
