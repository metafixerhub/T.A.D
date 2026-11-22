import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Terminal, 
  Cpu, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Code, 
  Bot, 
  Brain, 
  CheckCircle2, 
  Award, 
  BookOpen, 
  Zap, 
  Flame, 
  Compass, 
  Wrench, 
  Rocket, 
  Check, 
  X, 
  ExternalLink, 
  HelpCircle, 
  MessageSquare, 
  Volume2, 
  FileCode, 
  FolderGit2, 
  Globe2, 
  Workflow, 
  Database, 
  ChevronRight,
  TrendingUp,
  Lightbulb,
  GraduationCap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = ({ onLoginClick }) => {
  // Modal state for Programme Details
  const [selectedProgramme, setSelectedProgramme] = useState(null);

  // Hello G Interactive Sandbox Prompt
  const [activeHelloGQuestion, setActiveHelloGQuestion] = useState(0);

  const helloGSamples = [
    {
      q: "How does an AI Agent make decisions?",
      a: "An AI Agent uses a perception-reasoning-action loop: it observes the environment (inputs), leverages a Large Language Model for reasoning, selects an optimal tool or function, and executes actions to accomplish specific goals autonomously."
    },
    {
      q: "Why start with Python for programming?",
      a: "Python features clean, English-like syntax that minimizes syntax boilerplate, letting you master core computational logic, data structures, algorithms, and AI frameworks like PyTorch and FastAPI with high productivity."
    },
    {
      q: "What makes project-based learning superior?",
      a: "Building real software forces you to solve real errors, architect scalable databases, manage Git version control, and deploy live cloud applications—skills that passive video watching can never deliver."
    }
  ];

  // Programme Data
  const programmes = [
    {
      id: 'advance-coding',
      badge: 'Most Popular · Foundations to Advanced',
      title: 'Advance Coding Master',
      tagline: 'Master modern programming, algorithms, web architectures, and defensive coding from the ground up.',
      icon: <Terminal size={28} color="#38bdf8" />,
      color: '#38bdf8',
      gradient: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)',
      border: 'rgba(56, 189, 248, 0.3)',
      duration: '16 Weeks Intensive',
      level: 'Beginner to Advanced',
      modules: [
        'Python Foundations & OOP',
        'Web Development (HTML5, Modern CSS, Responsive Layouts)',
        'Cyber Security & Web Defenses',
        'JavaScript (ES6+, DOM, Asynchronous Programming)',
        'Artificial Intelligence & API Integration',
        'Advanced Coding Projects (Full Applications)'
      ],
      outcomes: 'Graduate capable of building responsive web applications, secure scripts, and integrating AI into practical tools.'
    },
    {
      id: 'digital-systems',
      badge: 'Full-Stack & Systems Engineering',
      title: 'Digital Systems Developer',
      tagline: 'Build scalable backend systems, cloud architectures, REST APIs, and production database solutions.',
      icon: <Layers size={28} color="#10b981" />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
      border: 'rgba(16, 185, 129, 0.3)',
      duration: '20 Weeks Immersive',
      level: 'Intermediate to Industry-Ready',
      modules: [
        'Advanced Programming & Data Structures',
        'Full-Stack Development (React & Node.js ecosystem)',
        'Databases & APIs (SQL, MongoDB, RESTful Endpoints)',
        'Git & GitHub Collaboration Workflows',
        'Cloud & Deployment (Render, Vercel, Production Ops)',
        'Real-World Production Projects'
      ],
      outcomes: 'Create and deploy full-stack systems with end-to-end authentication, database persistence, and cloud hosting.'
    },
    {
      id: 'ai-future-tech',
      badge: 'Next-Gen Frontiers & Intelligence',
      title: 'AI & Future Technology Master',
      tagline: 'Step into the future: build LLM applications, generative AI workflows, autonomous agents, and smart automations.',
      icon: <Sparkles size={28} color="#f59e0b" />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
      border: 'rgba(245, 158, 11, 0.3)',
      duration: '18 Weeks Specialized',
      level: 'Forward-Looking Innovators',
      modules: [
        'Machine Learning Fundamentals & Model Intuition',
        'Generative AI & Multimodal Models (Text, Vision, Audio)',
        'Large Language Models (Prompt Engineering & Fine-tuning)',
        'AI Agents & Autonomous Decision Frameworks',
        'AI Automation & Tool-Calling Workflows',
        'Advanced AI Capstone Projects'
      ],
      outcomes: 'Design, develop, and integrate state-of-the-art AI agents and generative tools that solve complex modern tasks.'
    }
  ];

  // Why Choose Items
  const whyChooseItems = [
    {
      title: 'Practical Project-Based Learning',
      desc: 'Build real, working software rather than memorizing theory. Gain muscle memory by coding daily.',
      icon: <Code size={24} color="#38bdf8" />
    },
    {
      title: 'Beginner-Friendly Education',
      desc: 'Carefully structured step-by-step pathways ensure that learners of all backgrounds gain mastery.',
      icon: <Compass size={24} color="#10b981" />
    },
    {
      title: 'AI-Powered Learning Support',
      desc: 'Hello G, your dedicated 24/7 AI tutor, breaks down complex logic, clarifies doubts, and helps debug code.',
      icon: <Bot size={24} color="#c084fc" />
    },
    {
      title: 'Structured Learning Programmes',
      desc: 'Clear, progressive roadmaps curated by experienced software engineers to eliminate overwhelm.',
      icon: <Layers size={24} color="#f59e0b" />
    },
    {
      title: 'Technology-Focused Education',
      desc: 'Modern, high-demand stacks: Python, JavaScript, Cloud, Generative AI, and Cyber Security fundamentals.',
      icon: <Cpu size={24} color="#60a5fa" />
    },
    {
      title: 'Skill Development',
      desc: 'Focus on job-ready engineering practices, code architecture, Git workflows, and deployment standards.',
      icon: <TrendingUp size={24} color="#34d399" />
    },
    {
      title: 'Creative Problem Solving',
      desc: 'Learn how to think like an engineer, decompose complex problems, and craft innovative digital solutions.',
      icon: <Lightbulb size={24} color="#fbbf24" />
    },
    {
      title: 'Certification Opportunities',
      desc: 'Demonstrate demonstrated knowledge through rigorous center practical evaluations and project submissions.',
      icon: <Award size={24} color="#f43f5e" />
    }
  ];

  // Learning Experience Journey
  const learningSteps = [
    { num: '01', title: 'Explore', subtitle: 'Discover your interests', desc: 'Find your passion across coding, systems, cyber security, and artificial intelligence.', color: '#38bdf8' },
    { num: '02', title: 'Learn', subtitle: 'Understand concepts step by step', desc: 'Grasp fundamental computational theory with guided tutorials, live sessions, and practical lessons.', color: '#818cf8' },
    { num: '03', title: 'Practise', subtitle: 'Work on practical exercises', desc: 'Solve targeted coding challenges, debug real issues, and reinforce your computational skills.', color: '#10b981' },
    { num: '04', title: 'Build', subtitle: 'Create real-world projects', desc: 'Apply knowledge to build full-scale web applications, AI tools, and production-grade software.', color: '#f59e0b' },
    { num: '05', title: 'Evaluate', subtitle: 'Test your knowledge', desc: 'Validate your competence with timed assessments, MCQ evaluations, and objective project reviews.', color: '#ec4899' },
    { num: '06', title: 'Achieve', subtitle: 'Complete your learning journey', desc: 'Earn verified credentials, showcase a functional GitHub portfolio, and build your digital future.', color: '#a855f7' }
  ];

  // Student Projects
  const studentProjects = [
    {
      title: 'AI Chatbots & Virtual Tutors',
      category: 'Artificial Intelligence',
      desc: 'Custom conversational agents built with LLMs and prompt chains that provide personalized learning guidance.',
      tags: ['LLMs', 'Python', 'OpenRouter', 'Streamlit'],
      icon: <Bot size={22} color="#c084fc" />
    },
    {
      title: 'AI Image Generators',
      category: 'Generative AI',
      desc: 'Creative diffusion-based visual tools allowing students to produce high-resolution imagery from text briefs.',
      tags: ['Diffusion', 'Prompt Engineering', 'React', 'APIs'],
      icon: <Sparkles size={22} color="#f59e0b" />
    },
    {
      title: 'Educational Websites & Portals',
      category: 'Web Development',
      desc: 'Interactive, accessible e-learning portals featuring responsive layouts, live video integration, and quizzes.',
      tags: ['React', 'CSS Modules', 'Vite', 'Firebase'],
      icon: <Globe2 size={22} color="#38bdf8" />
    },
    {
      title: 'Smart Automation Tools',
      category: 'Automation & DevOps',
      desc: 'Headless automation pipelines and data scraping bots that automate repetitive administrative tasks.',
      tags: ['Node.js', 'Automation', 'Python', 'Cron'],
      icon: <Workflow size={22} color="#10b981" />
    },
    {
      title: 'Full-Stack Web Applications',
      category: 'Software Engineering',
      desc: 'Cloud-hosted enterprise web applications equipped with role-based authentication and MongoDB databases.',
      tags: ['MongoDB', 'Express', 'React', 'Cloud'],
      icon: <Database size={22} color="#60a5fa" />
    },
    {
      title: 'Digital Innovation Projects',
      category: 'Emerging Tech',
      desc: 'Innovative solutions combining cyber defense scanners, hardware IoT monitors, and algorithmic utilities.',
      tags: ['Cyber Security', 'Algorithms', 'APIs', 'IoT'],
      icon: <Cpu size={22} color="#f43f5e" />
    }
  ];

  const handleSpeakSample = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div style={{
      background: '#070d1e',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      overflowX: 'hidden'
    }}>

      {/* ========================================================
          1. HERO SECTION
         ======================================================== */}
      <section style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        padding: '70px 24px 90px 24px',
        background: 'radial-gradient(ellipse at 80% 20%, rgba(37, 99, 235, 0.18) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 60%)'
      }}>
        {/* Subtle grid background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          opacity: 0.35,
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '1240px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '50px',
            alignItems: 'center'
          }}>
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              {/* Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 18px',
                borderRadius: '9999px',
                background: 'rgba(59, 130, 246, 0.12)',
                border: '1px solid rgba(59, 130, 246, 0.35)',
                color: '#60a5fa',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '24px'
              }}>
                <ShieldCheck size={16} color="#38bdf8" />
                HAITED · HIGHER ACADEMY FOR INNOVATION, TECH & DEV
              </div>

              {/* Main Heading */}
              <h1 style={{
                fontSize: 'clamp(2.6rem, 5.2vw, 4.2rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                margin: '0 0 22px 0'
              }}>
                Build Your Future with <br />
                <span style={{
                  background: 'linear-gradient(135deg, #38bdf8 0%, #60a5fa 50%, #f59e0b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Technology.
                </span>
              </h1>

              {/* Supporting Text */}
              <p style={{
                fontSize: '1.18rem',
                lineHeight: 1.65,
                color: '#cbd5e1',
                margin: '0 0 32px 0',
                maxWidth: '560px'
              }}>
                Learn coding, artificial intelligence and digital skills through practical projects, expert-guided learning and innovative educational programmes.
              </p>

              {/* CTA Action Buttons */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '36px' }}>
                <a
                  href="#programmes"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '16px 32px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    color: '#ffffff',
                    fontSize: '1.02rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.5)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Explore Programmes <ArrowRight size={18} />
                </a>

                <button
                  onClick={onLoginClick}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '16px 30px',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    color: '#f8fafc',
                    fontSize: '1.02rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Start Learning 🚀
                </button>
              </div>

              {/* Trust Tagline Pills */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                flexWrap: 'wrap',
                fontSize: '0.85rem',
                color: '#94a3b8'
              }}>
                <span style={{ color: '#fbbf24', fontWeight: 800 }}>Learn • Build • Grow • Achieve</span>
                <span>•</span>
                <span>Practical Project-Based</span>
                <span>•</span>
                <span>AI Tutor Equipped</span>
              </div>
            </motion.div>

            {/* Right Hero Visual (3D Tech Illustration & Floating Glass Badges) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}
            >
              {/* Radial Aura Glow */}
              <div style={{
                position: 'absolute',
                width: '90%',
                height: '90%',
                background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, rgba(37, 99, 235, 0.15) 50%, transparent 75%)',
                filter: 'blur(50px)',
                borderRadius: '50%',
                zIndex: 0
              }} />

              {/* Main 3D Technology Illustration */}
              <motion.img
                src="/hero_illustration.png"
                alt="AI and Coding Illustration"
                style={{
                  width: '100%',
                  maxWidth: '540px',
                  height: 'auto',
                  position: 'relative',
                  zIndex: 1,
                  filter: 'drop-shadow(0 25px 35px rgba(0, 0, 0, 0.6))'
                }}
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              />

              {/* Floating Glass Badge 1: AI Powered */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut', delay: 0.5 }}
                style={{
                  position: 'absolute',
                  top: '12%',
                  left: '-4%',
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  borderRadius: '16px',
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.5)',
                  zIndex: 2
                }}
              >
                <div style={{ background: 'rgba(168, 85, 247, 0.2)', padding: '8px', borderRadius: '10px' }}>
                  <Bot size={20} color="#c084fc" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>TUTOR ASSISTANT</div>
                  <div style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 700 }}>Hello G AI Active</div>
                </div>
              </motion.div>

              {/* Floating Glass Badge 2: Real Projects */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut', delay: 1 }}
                style={{
                  position: 'absolute',
                  bottom: '10%',
                  right: '-4%',
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '16px',
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.5)',
                  zIndex: 2
                }}
              >
                <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '8px', borderRadius: '10px' }}>
                  <Code size={20} color="#34d399" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>CURRICULUM METHOD</div>
                  <div style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 700 }}>100% Practical Code</div>
                </div>
              </motion.div>

            </motion.div>

          </div>
        </div>
      </section>

      {/* ========================================================
          2. ABOUT HAITED SECTION
         ======================================================== */}
      <section id="about" style={{
        padding: '90px 24px',
        background: 'linear-gradient(180deg, #070d1e 0%, #0a1228 100%)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#fbbf24',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '14px'
            }}>
              About HAITED
            </span>
            <h2 style={{
              fontSize: 'clamp(2rem, 3.8vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              margin: '0 0 18px 0'
            }}>
              More Than Learning. A Future of Innovation.
            </h2>
            <p style={{
              fontSize: '1.12rem',
              lineHeight: 1.7,
              color: '#94a3b8',
              maxWidth: '820px',
              margin: '0 auto'
            }}>
              HAITED (Higher Academy for Innovation, Technology, Education & Development) is an education and technology initiative dedicated to helping learners understand technology through practical training, creative thinking and project-based education.
            </p>
          </div>

          {/* 5 Core Pillars Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            {[
              {
                title: 'Practical Learning',
                desc: 'Writing code every day. Building real software products that run locally and on the cloud.',
                icon: <Code size={24} color="#38bdf8" />,
                border: 'rgba(56, 189, 248, 0.3)'
              },
              {
                title: 'Technology Education',
                desc: 'Comprehensive computer science fundamentals, modern frameworks, and architectural thinking.',
                icon: <Cpu size={24} color="#10b981" />,
                border: 'rgba(16, 185, 129, 0.3)'
              },
              {
                title: 'AI-Powered Learning',
                desc: 'Empowering students with smart AI tutors for instant code guidance, conceptual clarity, and hints.',
                icon: <Bot size={24} color="#c084fc" />,
                border: 'rgba(168, 85, 247, 0.3)'
              },
              {
                title: 'Innovation & Creativity',
                desc: 'Nurturing original ideas into interactive prototypes, digital automations, and practical tools.',
                icon: <Lightbulb size={24} color="#fbbf24" />,
                border: 'rgba(251, 191, 36, 0.3)'
              },
              {
                title: 'Skill Development',
                desc: 'Closing the gap between textbook theory and real-world software engineering capabilities.',
                icon: <TrendingUp size={24} color="#f43f5e" />,
                border: 'rgba(244, 63, 94, 0.3)'
              }
            ].map((pillar, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${pillar.border}`,
                  borderRadius: '18px',
                  padding: '28px 22px',
                  transition: 'border 0.2s, box-shadow 0.2s'
                }}
              >
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px'
                }}>
                  {pillar.icon}
                </div>
                <h3 style={{ fontSize: '1.12rem', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>
                  {pillar.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                  {pillar.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Vision Banner */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(245, 158, 11, 0.12) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '20px',
            padding: '28px 32px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                THE HAITED ETHOS
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
                "Technology is best learned by building. Every line of code leads to capability."
              </div>
            </div>
            <div style={{
              display: 'flex',
              gap: '12px',
              color: '#38bdf8',
              fontSize: '0.95rem',
              fontWeight: 700
            }}>
              <span>Learn</span> • <span>Build</span> • <span>Grow</span> • <span>Achieve</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          3. OUR LEARNING PROGRAMMES
         ======================================================== */}
      <section id="programmes" style={{
        padding: '100px 24px',
        background: '#070d1e',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '14px'
            }}>
              Curated Curriculum
            </span>
            <h2 style={{
              fontSize: 'clamp(2rem, 3.8vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              margin: '0 0 16px 0'
            }}>
              Our Learning Programmes
            </h2>
            <p style={{
              fontSize: '1.12rem',
              color: '#94a3b8',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Structured, future-ready programmes crafted to take you from core programming syntax to production-grade engineering.
            </p>
          </div>

          {/* 3 Programme Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {programmes.map((prog) => (
              <motion.div
                key={prog.id}
                whileHover={{ y: -8 }}
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  backdropFilter: 'blur(16px)',
                  border: `1.5px solid ${prog.border}`,
                  borderRadius: '24px',
                  padding: '36px 30px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.6)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Top Subtle Ambient Glow */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: prog.color
                }} />

                <div>
                  {/* Badge */}
                  <span style={{
                    display: 'inline-block',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: prog.color,
                    marginBottom: '20px'
                  }}>
                    {prog.badge}
                  </span>

                  {/* Header Title & Icon */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                    <div style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${prog.border}`
                    }}>
                      {prog.icon}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                        {prog.title}
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                        {prog.duration} · {prog.level}
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.94rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '24px' }}>
                    {prog.tagline}
                  </p>

                  {/* Modules List */}
                  <div style={{ marginBottom: '28px' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.04em', marginBottom: '12px' }}>
                      Key Focus Areas:
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {prog.modules.map((mod, mIdx) => (
                        <li key={mIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: '#e2e8f0' }}>
                          <CheckCircle2 size={16} color={prog.color} style={{ marginTop: '2px', flexShrink: 0 }} />
                          <span>{mod}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Action */}
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px' }}>
                  <button
                    onClick={() => setSelectedProgramme(prog)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      background: prog.gradient,
                      border: `1px solid ${prog.border}`,
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Learn More <ChevronRight size={16} />
                  </button>
                </div>

              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          4. AI LEARNING ASSISTANT — HELLO G
         ======================================================== */}
      <section id="hello-g" style={{
        padding: '100px 24px',
        background: 'radial-gradient(ellipse at 50% 50%, rgba(147, 51, 234, 0.15) 0%, #070d1e 80%)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div style={{
            background: 'rgba(17, 24, 39, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(168, 85, 247, 0.35)',
            borderRadius: '28px',
            padding: '50px 40px',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(168, 85, 247, 0.15)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'center'
            }}>
              
              {/* Left Details */}
              <div>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  background: 'rgba(168, 85, 247, 0.15)',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  color: '#c084fc',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '18px'
                }}>
                  <Sparkles size={15} /> AI Teaching Assistant
                </span>

                <h2 style={{
                  fontSize: 'clamp(2.2rem, 3.5vw, 3rem)',
                  fontWeight: 900,
                  color: '#ffffff',
                  lineHeight: 1.15,
                  margin: '0 0 18px 0'
                }}>
                  Meet Hello G — <br />
                  <span style={{
                    background: 'linear-gradient(135deg, #c084fc 0%, #38bdf8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Your Intelligent Learning Companion
                  </span>
                </h2>

                <p style={{
                  fontSize: '1.1rem',
                  lineHeight: 1.7,
                  color: '#cbd5e1',
                  margin: '0 0 28px 0'
                }}>
                  Your intelligent learning companion. Ask questions, explore concepts, understand code and get learning support through AI. Available 24/7 to clear blockers whenever you code.
                </p>

                {/* Capabilities check */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
                  {[
                    'Instant code explanation',
                    '24/7 concept breakdown',
                    'Voice & audio responses',
                    'Context-aware hints'
                  ].map((feat, fIdx) => (
                    <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#e2e8f0' }}>
                      <Check size={16} color="#34d399" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      const chatToggle = document.querySelector('[aria-label="chat-toggle"], [title="Open Chatbot"], button');
                      if (chatToggle) chatToggle.click();
                      else alert("Hello G is ready! You can interact directly in the preview box or open the floating chatbot at the bottom right.");
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '14px 28px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
                      color: '#ffffff',
                      fontSize: '0.98rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 8px 20px rgba(147, 51, 234, 0.4)'
                    }}
                  >
                    <Bot size={18} /> Meet Hello G
                  </button>

                  <a
                    href="#why-choose"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '14px 24px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#ffffff',
                      fontSize: '0.98rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      border: '1px solid rgba(255, 255, 255, 0.15)'
                    }}
                  >
                    Learn How It Works ↓
                  </a>
                </div>
              </div>

              {/* Right: Live Interactive Prompt Simulation */}
              <div style={{
                background: '#0b1120',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Sparkles size={18} color="#c084fc" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>Hello G Interactive Preview</div>
                      <div style={{ fontSize: '0.75rem', color: '#34d399' }}>● Online & Ready</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSpeakSample(helloGSamples[activeHelloGQuestion].a)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: 'none',
                      color: '#c084fc',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem'
                    }}
                  >
                    <Volume2 size={13} /> Listen
                  </button>
                </div>

                {/* Sample Prompt Pills */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
                    Try Asking Hello G:
                  </div>
                  {helloGSamples.map((sample, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => setActiveHelloGQuestion(sIdx)}
                      style={{
                        textAlign: 'left',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: activeHelloGQuestion === sIdx ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                        border: activeHelloGQuestion === sIdx ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.06)',
                        color: activeHelloGQuestion === sIdx ? '#ffffff' : '#94a3b8',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      💬 "{sample.q}"
                    </button>
                  ))}
                </div>

                {/* Simulated Response Box */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '16px',
                  fontSize: '0.88rem',
                  lineHeight: 1.6,
                  color: '#e2e8f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c084fc', fontWeight: 700, fontSize: '0.8rem', marginBottom: '6px' }}>
                    <Bot size={14} /> Hello G Response:
                  </div>
                  {helloGSamples[activeHelloGQuestion].a}
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          5. WHY CHOOSE HAITED?
         ======================================================== */}
      <section id="why-choose" style={{
        padding: '100px 24px',
        background: '#0a1226',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '14px'
            }}>
              Distinct Advantage
            </span>
            <h2 style={{
              fontSize: 'clamp(2rem, 3.8vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              margin: '0 0 16px 0'
            }}>
              Why Choose HAITED?
            </h2>
            <p style={{
              fontSize: '1.12rem',
              color: '#94a3b8',
              maxWidth: '680px',
              margin: '0 auto'
            }}>
              An engineering-first academy built around how modern software developers truly gain competency.
            </p>
          </div>

          {/* 8 Feature Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px'
          }}>
            {whyChooseItems.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6, borderColor: 'rgba(59, 130, 246, 0.5)' }}
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '28px 24px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px'
                }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          6. LEARNING EXPERIENCE (VISUAL TIMELINE)
         ======================================================== */}
      <section id="experience" style={{
        padding: '100px 24px',
        background: '#070d1e',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'rgba(59, 130, 246, 0.12)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: '#60a5fa',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '14px'
            }}>
              Your Educational Pathway
            </span>
            <h2 style={{
              fontSize: 'clamp(2rem, 3.8vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              margin: '0 0 16px 0'
            }}>
              The HAITED Learning Experience
            </h2>
            <p style={{
              fontSize: '1.12rem',
              color: '#94a3b8',
              maxWidth: '680px',
              margin: '0 auto'
            }}>
              A transparent, 6-stage progressive student journey from initial interest to certified accomplishment.
            </p>
          </div>

          {/* Timeline Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '18px'
          }}>
            {learningSteps.map((step, sIdx) => (
              <div
                key={sIdx}
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '26px 20px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Step Number Top Badge */}
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: step.color,
                  lineHeight: 1,
                  marginBottom: '14px',
                  opacity: 0.9
                }}>
                  {step.num}
                </div>

                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                  {step.title}
                </div>

                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: step.color, marginBottom: '12px' }}>
                  {step.subtitle}
                </div>

                <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          7. PROJECTS & INNOVATION
         ======================================================== */}
      <section id="projects" style={{
        padding: '100px 24px',
        background: '#0a1226',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#fbbf24',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '14px'
            }}>
              Applied Software
            </span>
            <h2 style={{
              fontSize: 'clamp(2rem, 3.8vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              margin: '0 0 16px 0'
            }}>
              Projects & Innovation
            </h2>
            <p style={{
              fontSize: '1.12rem',
              color: '#94a3b8',
              maxWidth: '680px',
              margin: '0 auto'
            }}>
              Real software constructed by learners tackling actual technology challenges and practical applications.
            </p>
          </div>

          {/* 6 Showcase Projects */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {studentProjects.map((proj, pIdx) => (
              <motion.div
                key={pIdx}
                whileHover={{ y: -6 }}
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {proj.icon}
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      color: '#94a3b8'
                    }}>
                      {proj.category}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '10px' }}>
                    {proj.title}
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '20px' }}>
                    {proj.desc}
                  </p>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  {proj.tags.map((t, tIdx) => (
                    <span key={tIdx} style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#38bdf8',
                      background: 'rgba(56, 189, 248, 0.1)',
                      padding: '3px 10px',
                      borderRadius: '6px'
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          8. CERTIFICATION & ASSESSMENT
         ======================================================== */}
      <section id="certification" style={{
        padding: '100px 24px',
        background: '#070d1e',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '14px'
            }}>
              Demonstrated Mastery
            </span>
            <h2 style={{
              fontSize: 'clamp(2rem, 3.8vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              margin: '0 0 16px 0'
            }}>
              Certification & Assessment
            </h2>
            <p style={{
              fontSize: '1.12rem',
              color: '#94a3b8',
              maxWidth: '720px',
              margin: '0 auto'
            }}>
              Learners demonstrate authentic, verifiable knowledge through rigorous practical evaluations and real code execution.
            </p>
          </div>

          {/* 4 Assessment Modes Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
            {[
              {
                title: 'MCQ Assessments',
                desc: 'Objective conceptual evaluations with timed rules, instant evaluation feedback, and audio speech assist.',
                icon: <FileCode size={24} color="#38bdf8" />
              },
              {
                title: 'Practical Examinations',
                desc: 'Hands-on debugging, logic implementation, and code writing under authenticated center guidelines.',
                icon: <Terminal size={24} color="#10b981" />
              },
              {
                title: 'Project Submissions',
                desc: 'Independent capstone projects submitted with live hosted URLs and inspected GitHub code repositories.',
                icon: <FolderGit2 size={24} color="#f59e0b" />
              },
              {
                title: 'Learning Evaluations',
                desc: 'Continuous concept mastery reviews tracking weekly watch time, homework, and module milestones.',
                icon: <Award size={24} color="#c084fc" />
              }
            ].map((evalItem, eIdx) => (
              <div
                key={eIdx}
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '28px 24px'
                }}
              >
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px'
                }}>
                  {evalItem.icon}
                </div>
                <h3 style={{ fontSize: '1.18rem', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>
                  {evalItem.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                  {evalItem.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Live Center Test Callout Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.35)',
            borderRadius: '22px',
            padding: '32px 36px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px'
          }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                <ShieldCheck size={16} /> Official Center Test Available
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: '0 0 6px 0' }}>
                I REMEMBER TEST · Pre-exams Recommended by the Center (14-Nov-26)
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.94rem', margin: 0, maxWidth: '640px' }}>
                80 Marks · 37 Questions · Instant answer evaluation, interactive AI tutor hints, voice reader, and MongoDB score recording.
              </p>
            </div>

            <Link
              to="/test/001-haited/-Pre-exams-recommended-by-the-center/14-nov-26"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 26px',
                borderRadius: '12px',
                background: '#2563eb',
                color: '#ffffff',
                fontSize: '0.96rem',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.4)'
              }}
            >
              Take Assessment Now <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================
          9. CALL TO ACTION SECTION (CTA)
         ======================================================== */}
      <section style={{
        padding: '110px 24px',
        background: 'radial-gradient(ellipse at 50% 50%, rgba(37, 99, 235, 0.22) 0%, #070d1e 75%)',
        position: 'relative',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 20px',
            borderRadius: '9999px',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            color: '#fbbf24',
            fontSize: '0.82rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '24px'
          }}>
            <Flame size={16} /> Begin Your Journey Today
          </div>

          <h2 style={{
            fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)',
            fontWeight: 900,
            color: '#ffffff',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            margin: '0 0 20px 0'
          }}>
            Your Future Starts with <br />
            <span style={{
              background: 'linear-gradient(135deg, #38bdf8 0%, #60a5fa 50%, #fbbf24 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              One Step.
            </span>
          </h2>

          <p style={{
            fontSize: '1.2rem',
            lineHeight: 1.65,
            color: '#cbd5e1',
            margin: '0 auto 38px auto',
            maxWidth: '620px'
          }}>
            Start learning, develop your skills and turn your ideas into technology. Join HAITED today and experience future-ready technology education.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={onLoginClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 36px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#ffffff',
                fontSize: '1.05rem',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 12px 28px -5px rgba(37, 99, 235, 0.55)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Join HAITED 🚀
            </button>

            <a
              href="#programmes"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 32px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#ffffff',
                fontSize: '1.05rem',
                fontWeight: 700,
                textDecoration: 'none',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Explore Courses ↓
            </a>
          </div>

        </div>
      </section>

      {/* ========================================================
          10. PROGRAMME DETAIL MODAL (WHEN 'LEARN MORE' CLICKED)
         ======================================================== */}
      <AnimatePresence>
        {selectedProgramme && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 9999
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                background: '#0b1329',
                border: `1.5px solid ${selectedProgramme.border}`,
                borderRadius: '24px',
                width: '100%',
                maxWidth: '680px',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)'
              }}
            >
              {/* Modal Header */}
              <div style={{
                padding: '24px 28px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(255, 255, 255, 0.02)'
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: selectedProgramme.color, textTransform: 'uppercase' }}>
                    {selectedProgramme.badge}
                  </span>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: '4px 0 0 0' }}>
                    {selectedProgramme.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProgramme(null)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: '#94a3b8',
                    borderRadius: '8px',
                    padding: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '28px', overflowY: 'auto' }}>
                <p style={{ color: '#cbd5e1', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '24px' }}>
                  {selectedProgramme.tagline}
                </p>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '24px',
                  fontSize: '0.88rem'
                }}>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>DURATION</span>
                    <strong style={{ color: '#ffffff' }}>{selectedProgramme.duration}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>LEVEL</span>
                    <strong style={{ color: '#ffffff' }}>{selectedProgramme.level}</strong>
                  </div>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '14px' }}>
                  Complete Syllabus Modules:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                  {selectedProgramme.modules.map((m, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      fontSize: '0.9rem',
                      color: '#e2e8f0'
                    }}>
                      <CheckCircle2 size={16} color={selectedProgramme.color} />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                  Graduate Outcomes:
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                  {selectedProgramme.outcomes}
                </p>
              </div>

              {/* Modal Footer */}
              <div style={{
                padding: '20px 28px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.02)'
              }}>
                <button
                  onClick={() => setSelectedProgramme(null)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#94a3b8',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    setSelectedProgramme(null);
                    onLoginClick();
                  }}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '10px',
                    background: '#2563eb',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)'
                  }}
                >
                  Enroll / Get Started →
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default HeroSection;
