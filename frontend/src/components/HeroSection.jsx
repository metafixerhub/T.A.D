import React from 'react';
import { motion } from 'framer-motion';
import { Shield, PlayCircle, Video, Trophy, BookOpen, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  // Glassmorphism Box Style
  const glassBoxStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
    borderRadius: '24px',
    padding: '40px 30px',
    textAlign: 'center',
    color: 'white'
  };

  return (
    <div style={{ 
      background: 'url(/premium-bg.png) center/cover no-repeat fixed', 
      minHeight: '100vh',
      overflow: 'hidden',
      color: 'white',
      fontFamily: '"Outfit", sans-serif'
    }}>
      
      {/* HERO SECTION */}
      <section className="container section-padding" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
        <div className="grid-2" style={{ alignItems: 'center' }}>
          
          {/* Left Text Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <motion.div variants={itemVariants} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', padding: '8px 20px', borderRadius: '30px', width: 'fit-content', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
              <Shield size={16} /> SECURE LEARNING PLATFORM
            </motion.div>
            
            <motion.h1 variants={itemVariants} style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1.1, margin: 0, color: '#ffffff', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              Master Cybersecurity & <br/><span style={{ background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Coding Systems</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} style={{ color: '#cbd5e1', fontSize: '1.2rem', margin: 0, maxWidth: '520px', lineHeight: 1.6, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              Elevate your skills with enterprise-grade course materials, interactive live sessions, and gamified practice challenges.
            </motion.p>
            
            <motion.div variants={itemVariants} style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
              <button style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', color: 'white', border: 'none', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 32px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 25px rgba(59,130,246,0.5)', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'} onClick={() => document.querySelector('.btn-outline')?.click()}>
                Get Started <ArrowRight size={20} />
              </button>
              <button style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 32px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                <PlayCircle size={20} /> Watch Demo
              </button>
            </motion.div>
          </motion.div>

          {/* Right Image Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}
          >
            {/* Glow behind image */}
            <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)', filter: 'blur(80px)', borderRadius: '50%', zIndex: 0, opacity: 0.4, transform: 'scale(0.8)' }}></div>
            
            <motion.img 
              src="/hero_illustration.png" 
              alt="Cybersecurity and Coding"
              style={{ width: '100%', maxWidth: '600px', height: 'auto', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.5))' }}
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            />
          </motion.div>

        </div>
      </section>

      {/* FEATURES SECTION (Glassmorphism) */}
      <section style={{ padding: '100px 0', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}></div>
        
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#ffffff', margin: '0 0 20px 0', textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>Everything You Need to Succeed</h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.2rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>An all-in-one premium platform designed for immersive learning and rapid skill development.</p>
          </div>

          <div className="grid-3">
            
            {/* Feature 1 */}
            <motion.div 
              whileHover={{ y: -15, background: 'rgba(255,255,255,0.08)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={glassBoxStyle}
            >
              <div style={{ width: '70px', height: '70px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px auto', boxShadow: '0 10px 20px rgba(37,99,235,0.4)' }}>
                <Video size={34} />
              </div>
              <h3 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '15px', fontWeight: 700 }}>Live Interactive Sessions</h3>
              <p style={{ color: '#94a3b8', lineHeight: 1.7, margin: 0, fontSize: '1.05rem' }}>Join secure, high-quality video classes with real-time screen sharing and pop quizzes.</p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              whileHover={{ y: -15, background: 'rgba(255,255,255,0.08)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={glassBoxStyle}
            >
              <div style={{ width: '70px', height: '70px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px auto', boxShadow: '0 10px 20px rgba(217,119,6,0.4)' }}>
                <Trophy size={34} />
              </div>
              <h3 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '15px', fontWeight: 700 }}>Gamified Practice</h3>
              <p style={{ color: '#94a3b8', lineHeight: 1.7, margin: 0, fontSize: '1.05rem' }}>Earn XP, climb the leaderboard, and unlock certificates by completing interactive challenges.</p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              whileHover={{ y: -15, background: 'rgba(255,255,255,0.08)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={glassBoxStyle}
            >
              <div style={{ width: '70px', height: '70px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px auto', boxShadow: '0 10px 20px rgba(5,150,105,0.4)' }}>
                <BookOpen size={34} />
              </div>
              <h3 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '15px', fontWeight: 700 }}>Secure Materials</h3>
              <p style={{ color: '#94a3b8', lineHeight: 1.7, margin: 0, fontSize: '1.05rem' }}>Access premium PDFs, code snippets, and recordings directly from the encrypted cloud vault.</p>
            </motion.div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default HeroSection;
