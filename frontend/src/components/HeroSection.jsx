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

  return (
    <div style={{ background: '#f8fafc', overflow: 'hidden' }}>
      
      {/* HERO SECTION */}
      <section className="container section-padding" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="grid-2" style={{ alignItems: 'center' }}>
          
          {/* Left Text Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <motion.div variants={itemVariants} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(37, 99, 235, 0.1)', border: '1px solid rgba(37, 99, 235, 0.3)', color: '#2563eb', padding: '6px 16px', borderRadius: '20px', width: 'fit-content', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.5px' }}>
              <Shield size={16} /> SECURE LEARNING PLATFORM
            </motion.div>
            
            <motion.h1 variants={itemVariants} style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.15, margin: 0, color: '#0f172a' }}>
              Master Cybersecurity & <br/><span className="text-cyan">Coding Systems</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} style={{ color: '#475569', fontSize: '1.15rem', margin: 0, maxWidth: '500px', lineHeight: 1.6 }}>
              Elevate your skills with enterprise-grade course materials, interactive live sessions, and gamified practice challenges.
            </motion.p>
            
            <motion.div variants={itemVariants} style={{ display: 'flex', gap: '15px', marginTop: '10px', flexWrap: 'wrap' }}>
              <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 28px', fontSize: '1.05rem' }} onClick={() => document.querySelector('.btn-outline').click()}>
                Get Started <ArrowRight size={18} />
              </button>
              <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 28px', fontSize: '1.05rem', background: 'white' }}>
                <PlayCircle size={18} /> Watch Demo
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
            {/* Floating decorative blob behind image */}
            <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'linear-gradient(135deg, #e0e7ff 0%, #dbeafe 100%)', filter: 'blur(60px)', borderRadius: '50%', zIndex: 0, opacity: 0.6, transform: 'scale(0.8)' }}></div>
            
            <motion.img 
              src="/hero_illustration.png" 
              alt="Cybersecurity and Coding"
              style={{ width: '100%', maxWidth: '550px', height: 'auto', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))' }}
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            />
          </motion.div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section style={{ background: 'white', padding: '100px 0', borderTop: '1px solid #f1f5f9' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 15px 0' }}>Everything You Need to Succeed</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>An all-in-one platform designed for immersive learning and rapid skill development.</p>
          </div>

          <div className="grid-3">
            
            {/* Feature 1 */}
            <motion.div 
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ background: '#f8fafc', padding: '40px 30px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}
            >
              <div style={{ width: '60px', height: '60px', background: '#eff6ff', color: '#2563eb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                <Video size={30} />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#1e293b', marginBottom: '15px' }}>Live Interactive Sessions</h3>
              <p style={{ color: '#64748b', lineHeight: 1.6, margin: 0 }}>Join secure, high-quality video classes with real-time screen sharing and pop quizzes.</p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ background: '#f8fafc', padding: '40px 30px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}
            >
              <div style={{ width: '60px', height: '60px', background: '#fffbeb', color: '#d97706', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                <Trophy size={30} />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#1e293b', marginBottom: '15px' }}>Gamified Practice</h3>
              <p style={{ color: '#64748b', lineHeight: 1.6, margin: 0 }}>Earn XP, climb the leaderboard, and unlock certificates by completing interactive challenges.</p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{ background: '#f8fafc', padding: '40px 30px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}
            >
              <div style={{ width: '60px', height: '60px', background: '#ecfdf5', color: '#059669', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                <BookOpen size={30} />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#1e293b', marginBottom: '15px' }}>Secure Materials</h3>
              <p style={{ color: '#64748b', lineHeight: 1.6, margin: 0 }}>Access premium PDFs, code snippets, and recordings directly from the cloud vault.</p>
            </motion.div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default HeroSection;
