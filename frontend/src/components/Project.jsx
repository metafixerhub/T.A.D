import React, { useState } from 'react';
import { BookOpen, CheckCircle, Award, Target, Laptop, Database, Code, Users, Server, Shield, Globe, Copy, Check } from 'lucide-react';

const Project = () => {
  const [copiedPromptId, setCopiedPromptId] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const prompts = [
    {
      id: 1,
      title: 'Prompt 1',
      text: 'Create a project named "AI Web Academy".\n\nThis is an AI-powered e-learning website, not a video learning platform. The website teaches students how to build websites using AI tools, frontend development, backend development, deployment, and debugging.\n\nCreate a modern project structure using React + TypeScript + Vite + Tailwind CSS.'
    },
    {
      id: 2,
      title: 'Prompt 2',
      text: 'Create a beautiful landing page with smooth animations using Framer Motion.\n\nSections:\n- Hero\n- Features\n- Learning Path\n- AI Assistant\n- Testimonials\n- Footer\n\nMake the design fully responsive.'
    },
    {
      id: 3,
      title: 'Prompt 3',
      text: 'Add Light Mode and Dark Mode.\n\nCreate a settings page where users can change colors and themes.'
    },
    {
      id: 4,
      title: 'Prompt 4',
      text: 'Implement Firebase Authentication.\n\nFeatures:\n- Google Login\n- Email Login\n- Registration\n- Logout\n- Protected Pages'
    },
    {
      id: 5,
      title: 'Prompt 5',
      text: 'Create a dashboard after login.\n\nDashboard sections:\n- My Courses\n- Learning Progress\n- AI Assistant\n- Projects\n- Notes'
    },
    {
      id: 6,
      title: 'Prompt 6',
      text: 'Create a Learning Roadmap page.\n\nTopics:\n1. HTML\n2. CSS\n3. JavaScript\n4. React\n5. Backend\n6. Databases\n7. APIs\n8. Deployment\n9. AI Development\n10. Bug Fixing'
    },
    {
      id: 7,
      title: 'Prompt 7',
      text: 'Create a chapter system.\n\nEach chapter should have:\n- Introduction\n- Theory\n- Examples\n- Practice\n- Project\n- Quiz'
    },
    {
      id: 8,
      title: 'Prompt 8',
      text: 'Create an interactive code editor page using Monaco Editor.\n\nStudents should be able to write HTML, CSS, and JavaScript and see live preview.'
    },
    {
      id: 9,
      title: 'Prompt 9',
      text: 'Create an AI Chatbot called "AI Mentor".\n\nFeatures:\n- Answer coding questions\n- Explain concepts\n- Give hints\n- Suggest projects'
    },
    {
      id: 10,
      title: 'Prompt 10',
      text: 'Integrate an AI model.\n\nUse any available free AI API or local model.\n\nIf no API key exists, create a mock AI response system.'
    },
    {
      id: 11,
      title: 'Prompt 11',
      text: 'Create an AI bug solver.\n\nStudents can paste code and receive:\n- Error explanation\n- Suggested fixes\n- Better code examples'
    },
    {
      id: 12,
      title: 'Prompt 12',
      text: 'Create an AI project generator.\n\nStudents can enter:\n"I want to build a calculator."\n\nThe AI should generate:\n- Features\n- Folder structure\n- Technologies\n- Steps'
    },
    {
      id: 13,
      title: 'Prompt 13',
      text: 'Create an AI learning planner.\n\nStudents enter:\n- Skill level\n- Goal\n- Available time\n\nGenerate a study roadmap.'
    },
    {
      id: 14,
      title: 'Prompt 14',
      text: 'Create a Notes section.\n\nStudents can:\n- Create notes\n- Edit notes\n- Delete notes\n- Save notes to Firebase.'
    },
    {
      id: 15,
      title: 'Prompt 15',
      text: 'Create a Project Showcase section.\n\nStudents can upload:\n- Screenshots\n- GitHub Links\n- Project descriptions.'
    },
    {
      id: 16,
      title: 'Prompt 16',
      text: 'Create a Resources page.\n\nInclude:\n- Documentation\n- Tutorials\n- Useful websites\n- Developer tools'
    },
    {
      id: 17,
      title: 'Prompt 17',
      text: 'Create an AI Scanner feature.\n\nAllow users to:\n- Upload screenshots\n- Upload code images\n\nThe AI should analyze the image and explain the code or UI.'
    },
    {
      id: 18,
      title: 'Prompt 18',
      text: 'Create a Lens feature similar to Google Lens for learning purposes.\n\nStudents upload an image of code or a website.\n\nThe AI explains:\n- Technologies used\n- Design ideas\n- Possible implementation.'
    },
    {
      id: 19,
      title: 'Prompt 19',
      text: 'Create quizzes for every chapter.\n\nFeatures:\n- Multiple choice\n- Score calculation\n- Progress tracking.'
    },
    {
      id: 20,
      title: 'Prompt 20',
      text: 'Create a progress system.\n\nTrack:\n- Completed chapters\n- Quiz scores\n- Projects completed.'
    },
    {
      id: 21,
      title: 'Prompt 21',
      text: 'Create badges and achievements.\n\nExamples:\n- HTML Beginner\n- React Developer\n- Bug Hunter\n- AI Explorer'
    },
    {
      id: 22,
      title: 'Prompt 22',
      text: 'Create an Admin Panel.\n\nAdmin can:\n- Manage chapters\n- Manage users\n- Add new content\n- View analytics.'
    },
    {
      id: 23,
      title: 'Prompt 23',
      text: 'Create a database structure using Firebase.\n\nCollections:\nusers\nchapters\nnotes\nprojects\nprogress\nquizzes\nachievements'
    },
    {
      id: 24,
      title: 'Prompt 24',
      text: 'Prepare the project for production.\n\nRequirements:\n- Error boundaries\n- Loading states\n- Responsive design\n- SEO optimization\n- Accessibility improvements'
    },
    {
      id: 25,
      title: 'Prompt 25',
      text: 'Prepare deployment.\n\nSteps:\n1. Create GitHub repository.\n2. Push code.\n3. Deploy on Vercel.\n4. Create README.\n5. Create installation guide.\n6. Create project documentation.\n7. Generate architecture diagram.\n\nThe website must be production-ready and suitable for an academic final project.'
    },
    {
      id: 26,
      title: 'Final Instruction for Anti-Gravity',
      text: 'Build this project step by step.\n\nDo not create a live class website.\n\nThis is an AI-powered e-learning platform that teaches students how websites are built using AI, frontend, backend, deployment, debugging, and project development.\n\nFocus on:\n- Clean architecture\n- Beautiful UI\n- Working AI features\n- Learning experience\n- Production-ready code\n- Proper documentation\n- Bug-free implementation\n\nYou can copy these prompts directly into Anti-Gravity in order.'
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', fontFamily: '"Outfit", sans-serif' }}>
      
      {/* Hero Banner */}
      <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', marginBottom: '40px', background: '#1e1e2f' }}>
        <img 
          src="/project-banner.png" 
          alt="Advance Coding Master Program" 
          style={{ width: '100%', height: '350px', objectFit: 'cover', opacity: 0.8 }} 
          onError={(e) => e.target.style.display = 'none'}
        />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px', background: 'linear-gradient(to top, rgba(15,23,42,1), rgba(15,23,42,0))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
            <Award size={36} color="#60a5fa" />
            <h1 style={{ margin: 0, fontSize: '2.8rem', color: 'white', fontWeight: 800, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              EDUVERSE AI
            </h1>
          </div>
          <p style={{ margin: 0, color: '#93c5fd', fontSize: '1.2rem', fontWeight: 500 }}>Master Project Documentation & Specifications</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px', marginBottom: '40px' }}>
        
        {/* Left Column: Documentation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Project Info */}
          <section style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', color: '#1f2937', marginTop: 0, marginBottom: '20px', borderBottom: '2px solid #f3f4f6', paddingBottom: '15px' }}>
              <BookOpen color="#3b82f6" /> Project Information
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', color: '#4b5563' }}>
              <div><b>Student Name:</b> [ENTER STUDENT NAME]</div>
              <div><b>School/College:</b> [ENTER SCHOOL NAME]</div>
              <div><b>Class/Grade:</b> [ENTER CLASS]</div>
              <div><b>Project Guide:</b> [ENTER TEACHER NAME]</div>
            </div>
            <div style={{ marginTop: '20px', padding: '20px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>EduVerse AI – Smart Interactive Learning Platform</h3>
              <p style={{ margin: 0, lineHeight: 1.6 }}>Build a modern, fully responsive, animated e-learning platform for students and teachers. The platform should look professional and be suitable for a final academic project worth 60 marks.</p>
            </div>
          </section>

          {/* Tech Stack */}
          <section style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', color: '#1f2937', marginTop: 0, marginBottom: '20px', borderBottom: '2px solid #f3f4f6', paddingBottom: '15px' }}>
              <Code color="#8b5cf6" /> 1. Technology Stack
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div>
                <h4 style={{ color: '#4c1d95', marginBottom: '10px' }}>Frontend</h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#4b5563', lineHeight: 1.6 }}>
                  <li>React + TypeScript + Vite</li>
                  <li>Tailwind CSS</li>
                  <li>Framer Motion</li>
                  <li>Chart.js</li>
                  <li>Lucide React Icons</li>
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#4c1d95', marginBottom: '10px' }}>Backend & Services</h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#4b5563', lineHeight: 1.6 }}>
                  <li>Firebase (Auth, Firestore, Storage, Realtime DB, Cloud Messaging)</li>
                  <li>Jitsi Meet API</li>
                  <li>Open Trivia Database API</li>
                  <li>MediaRecorder API</li>
                  <li>AI Chatbot API</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Features */}
          <section style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', color: '#1f2937', marginTop: 0, marginBottom: '20px', borderBottom: '2px solid #f3f4f6', paddingBottom: '15px' }}>
              <Server color="#10b981" /> System Features
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h4 style={{ color: '#065f46', marginBottom: '5px' }}>Live Class & Recording</h4>
                <p style={{ margin: 0, color: '#4b5563', fontSize: '0.95rem' }}>Integrate Jitsi Meet for Video/Audio calls, Screen Share, Raise Hand, and Meeting Links. Use MediaRecorder API for session recording and downloads.</p>
              </div>
              
              <div>
                <h4 style={{ color: '#065f46', marginBottom: '5px' }}>Live Chat & Community Forum</h4>
                <p style={{ margin: 0, color: '#4b5563', fontSize: '0.95rem' }}>Real-time messaging with group chat, emojis, file sharing. Forum features Q&A, upvotes, and categorical search.</p>
              </div>
              
              <div>
                <h4 style={{ color: '#065f46', marginBottom: '5px' }}>Course & Materials Management</h4>
                <p style={{ margin: 0, color: '#4b5563', fontSize: '0.95rem' }}>Teachers can create courses, upload videos/PDFs/assignments, and manage students. Students can enroll, watch, and download.</p>
              </div>

              <div>
                <h4 style={{ color: '#065f46', marginBottom: '5px' }}>Quiz & Leaderboard</h4>
                <p style={{ margin: 0, color: '#4b5563', fontSize: '0.95rem' }}>MCQ questions with timers, auto-grading, and score calculation. Global, Course, Weekly, and Monthly rankings stored in Firestore.</p>
              </div>

              <div>
                <h4 style={{ color: '#065f46', marginBottom: '5px' }}>AI Assistant (EduVerse AI)</h4>
                <p style={{ margin: 0, color: '#4b5563', fontSize: '0.95rem' }}>Chatbot for homework help, explaining concepts, generating quizzes, and study planning.</p>
              </div>
            </div>
          </section>

          {/* Security & Deployment */}
          <section style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', color: '#1f2937', marginTop: 0, marginBottom: '20px', borderBottom: '2px solid #f3f4f6', paddingBottom: '15px' }}>
              <Shield color="#ef4444" /> Security & Deployment
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <h4 style={{ color: '#991b1b', marginBottom: '10px' }}>Security Measures</h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#4b5563', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  <li>Input Validation & Rate Limiting</li>
                  <li>Firestore Security Rules</li>
                  <li>Route Protection & Activity Logs</li>
                  <li>Mitigation for XSS, CSRF, Injection</li>
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#991b1b', marginBottom: '10px' }}>Deployment Pipeline</h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#4b5563', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  <li>GitHub Repository Push</li>
                  <li>Vercel Hosting</li>
                  <li>API Documentation & README</li>
                  <li>Architecture Diagram Included</li>
                </ul>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column: Assessment Scheme */}
        <div>
          <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', position: 'sticky', top: '20px' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Target size={20} /> Assessment Scheme
            </h3>
            
            <div style={{ background: 'white', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
              <div style={{ color: '#4b5563', fontSize: '0.9rem', marginBottom: '5px' }}>Project Submission</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563eb' }}>60 Marks</div>
            </div>
            
            <div style={{ background: 'white', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
              <div style={{ color: '#4b5563', fontSize: '0.9rem', marginBottom: '5px' }}>Practical Exam</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#d97706' }}>20 Marks</div>
            </div>
            
            <div style={{ background: 'white', padding: '15px', borderRadius: '8px', marginBottom: '25px' }}>
              <div style={{ color: '#4b5563', fontSize: '0.9rem', marginBottom: '5px' }}>MCQ Exam (40 Qs)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a' }}>20 Marks</div>
            </div>

            <div style={{ borderTop: '2px dashed #bfdbfe', paddingTop: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#1e3a8a' }}>Project Breakdown</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.6 }}>
                <li>Idea & Creativity: 15</li>
                <li>Design & UI: 10</li>
                <li>Code & Function: 20</li>
                <li>Documentation: 10</li>
                <li>Presentation: 5</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* Prompts Section */}
      <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', marginBottom: '40px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.8rem', color: '#1f2937', marginTop: 0, marginBottom: '30px', borderBottom: '2px solid #f3f4f6', paddingBottom: '15px' }}>
          <Code color="#3b82f6" size={28} /> AI Master Prompts
        </h2>
        <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '30px' }}>
          Copy these prompts in order and provide them to the AI to build your final project step-by-step.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {prompts.map((prompt) => (
            <div key={prompt.id} style={{ background: '#1e1e1e', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
              
              {/* Header */}
              <div style={{ background: '#2d2d2d', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #404040' }}>
                <span style={{ color: '#e5e7eb', fontWeight: 600, fontSize: '0.95rem' }}>{prompt.title}</span>
                <button 
                  onClick={() => handleCopy(prompt.text, prompt.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: copiedPromptId === prompt.id ? '#16a34a' : '#4b5563', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'background 0.2s' }}
                >
                  {copiedPromptId === prompt.id ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Prompt</>}
                </button>
              </div>

              {/* Code/Text Block */}
              <div style={{ padding: '20px' }}>
                <pre style={{ margin: 0, color: '#a78bfa', fontFamily: 'monospace', fontSize: '0.95rem', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {prompt.text}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Project;
