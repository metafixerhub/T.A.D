import React, { useState } from 'react';
import { BookOpen, CheckCircle, Award, Target, Laptop, Database, Code, Users, Server, Shield, Globe, Copy, Check, Star, UploadCloud } from 'lucide-react';

const Project = () => {
  const [copiedPromptId, setCopiedPromptId] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const prompts = [
    { id: 1, title: 'Prompt 1', text: 'Create a futuristic cyber-tech educational website called EduVerse AI with dark blue, black, cyan, and yellow colors. Make it fully responsive and animated.' },
    { id: 2, title: 'Prompt 2', text: 'Create a modern landing page with:\n- Hero section\n- Animated background\n- Feature cards\n- Join Now button\n- Login button\n- Footer' },
    { id: 3, title: 'Prompt 3', text: 'Create a responsive navigation bar:\n- Home\n- Courses\n- E-Books\n- Recordings\n- Projects\n- Dashboard\n- About\n- Contact\n- Login' },
    { id: 4, title: 'Prompt 4', text: 'Implement Google Sign-In authentication using Firebase Authentication.' },
    { id: 5, title: 'Prompt 5', text: 'Create a student dashboard showing:\n- Name\n- Profile photo\n- Courses\n- Progress\n- Certificates\n- Notifications' },
    { id: 6, title: 'Prompt 6', text: 'Create a course management page with:\n- Python\n- AI\n- Web Development\n- Cyber Security\n- Graphic Design' },
    { id: 7, title: 'Prompt 7', text: 'Create an e-book library system with categories and PDF downloads.' },
    { id: 8, title: 'Prompt 8', text: 'Create a video recordings page with search and filtering.' },
    { id: 9, title: 'Prompt 9', text: 'Integrate Firebase Realtime Database for:\n- User profiles\n- Course progress\n- Comments\n- Announcements' },
    { id: 10, title: 'Prompt 10', text: 'Create a project submission portal where students can upload:\n- GitHub Repository Link\n- Project Title\n- Description\n- Screenshots' },
    { id: 11, title: 'Prompt 11', text: 'Create a leaderboard system using Firebase.' },
    { id: 12, title: 'Prompt 12', text: 'Create a notification system:\n- New announcements\n- Course updates\n- Assignment reminders' },
    { id: 13, title: 'Prompt 13', text: 'Create a chatbot assistant.\n\nRequirements:\n- Floating chatbot button.\n- Unlimited free model.\n- Use Groq API or another free LLM API.\n- Answer questions about the website and courses.' },
    { id: 14, title: 'Prompt 14', text: 'Create an AI image generation section where users can generate educational images.' },
    { id: 15, title: 'Prompt 15', text: 'Create a discussion forum where students can ask questions and reply.' },
    { id: 16, title: 'Prompt 16', text: 'Create a coding playground:\n- HTML editor\n- CSS editor\n- JavaScript editor\n- Live preview' },
    { id: 17, title: 'Prompt 17', text: 'Create a download center for:\n- VS Code\n- Anti-Gravity\n- Python\n- Git\n- Learning resources' },
    { id: 18, title: 'Prompt 18', text: 'Create a profile settings page:\n- Change profile picture\n- Update information\n- Dark/Light mode' },
    { id: 19, title: 'Prompt 19', text: 'Create a certificates page showing completed courses and downloadable certificates.' },
    { id: 20, title: 'Prompt 20', text: 'Create an admin dashboard:\n- Manage users\n- Manage courses\n- Manage announcements\n- View project submissions' },
    { id: 21, title: 'Prompt 21', text: 'Implement security:\n- Input validation\n- Secure authentication\n- Firebase security rules\n- Error handling' },
    { id: 22, title: 'Prompt 22', text: 'Create a fully animated UI:\n- Glassmorphism\n- Hover effects\n- Loading animations\n- Smooth page transitions' },
    { id: 23, title: 'Prompt 23', text: 'Generate project documentation automatically:\n- Architecture\n- Technologies used\n- Features\n- Database structure' },
    { id: 24, title: 'Prompt 24', text: 'Create a GitHub deployment guide:\n1. Create GitHub account.\n2. Create public repository.\n3. Push source code.\n4. Copy repository link.\n5. Submit repository link in the portal.' },
    { id: 25, title: 'Prompt 25', text: 'Generate a complete README file containing:\n- Project overview\n- Installation steps\n- Features\n- Screenshots\n- Database setup\n- Deployment instructions\n- Future improvements' }
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
          <p style={{ margin: 0, color: '#93c5fd', fontSize: '1.2rem', fontWeight: 500 }}>Smart E-Learning & Coding Platform (Final Project)</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px', marginBottom: '40px' }}>
        
        {/* Left Column: Documentation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Project Objective */}
          <section style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', color: '#1f2937', marginTop: 0, marginBottom: '20px', borderBottom: '2px solid #f3f4f6', paddingBottom: '15px' }}>
              <BookOpen color="#3b82f6" /> Project Objective
            </h2>
            <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
              <p style={{ margin: 0, lineHeight: 1.6, color: '#334155', fontSize: '1.05rem' }}>
                Build a fully animated, modern e-learning website that teaches coding, AI, cyber security, and design. The platform should include authentication, real-time features, an AI chatbot, project submission, and a student dashboard.
              </p>
            </div>
          </section>

          {/* Recommended Technologies */}
          <section style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', color: '#1f2937', marginTop: 0, marginBottom: '20px', borderBottom: '2px solid #f3f4f6', paddingBottom: '15px' }}>
              <Code color="#8b5cf6" /> Recommended Technologies
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#4b5563', lineHeight: 1.8 }}>
                  <li><b>Frontend:</b> HTML, CSS, JavaScript, React (optional)</li>
                  <li><b>Backend:</b> Node.js + Express (optional)</li>
                  <li><b>Database:</b> Firebase Realtime DB or MongoDB</li>
                  <li><b>Authentication:</b> Google Sign-In</li>
                </ul>
              </div>
              <div>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#4b5563', lineHeight: 1.8 }}>
                  <li><b>Hosting:</b> Vercel or Netlify</li>
                  <li><b>Dev Tool:</b> VS Code</li>
                  <li><b>AI Tool:</b> Anti-Gravity</li>
                  <li><b>Version Control:</b> GitHub</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Bonus Features */}
          <section style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce3 100%)', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', color: '#166534', marginTop: 0, marginBottom: '20px', borderBottom: '2px solid #bbf7d0', paddingBottom: '15px' }}>
              <Star color="#15803d" /> Bonus Features (Optional)
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              {['AI-powered recommendation system', 'Daily coding challenges', 'Quiz system', 'Achievement badges', 'Theme customization', 'Multi-language support', 'Offline notes system', 'PWA support', 'Voice assistant', 'Dark and light themes'].map((feature, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <CheckCircle size={18} color="#16a34a" style={{ marginTop: '2px' }} />
                  <span style={{ color: '#166534', fontWeight: 500 }}>{feature}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Submission Requirements */}
          <section style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', color: '#1f2937', marginTop: 0, marginBottom: '20px', borderBottom: '2px solid #f3f4f6', paddingBottom: '15px' }}>
              <UploadCloud color="#ef4444" /> Submission Requirements
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <ol style={{ margin: 0, paddingLeft: '20px', color: '#4b5563', lineHeight: 1.8, fontWeight: 500 }}>
                <li>GitHub Repository Link</li>
                <li>Live Website Link</li>
                <li>Screenshots</li>
                <li>Project Documentation</li>
              </ol>
              <ol start="5" style={{ margin: 0, paddingLeft: '20px', color: '#4b5563', lineHeight: 1.8, fontWeight: 500 }}>
                <li>Database Structure Diagram</li>
                <li>Architecture Diagram</li>
                <li>AI Threat Model and Security</li>
                <li>README File</li>
              </ol>
            </div>
          </section>

        </div>

        {/* Right Column: Assessment Scheme */}
        <div>
          <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', position: 'sticky', top: '20px' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Target size={20} /> Marking Scheme
            </h3>
            
            <div style={{ background: 'white', padding: '15px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center' }}>
              <div style={{ color: '#4b5563', fontSize: '0.9rem', marginBottom: '5px' }}>Total Marks</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2563eb' }}>60</div>
            </div>

            <div style={{ borderTop: '2px dashed #bfdbfe', paddingTop: '20px' }}>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.8 }}>
                <li>Functionality: <b style={{ color: '#1e3a8a' }}>20 Marks</b></li>
                <li>UI/UX & Animation: <b style={{ color: '#1e3a8a' }}>10 Marks</b></li>
                <li>Database Integration: <b style={{ color: '#1e3a8a' }}>10 Marks</b></li>
                <li>Documentation: <b style={{ color: '#1e3a8a' }}>10 Marks</b></li>
                <li>Innovation & Extras: <b style={{ color: '#1e3a8a' }}>10 Marks</b></li>
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
          Copy these 25 master prompts in order and provide them to Anti-Gravity (or another AI) to build your final project step-by-step.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {prompts.map((prompt) => (
            <div key={prompt.id} style={{ background: '#121212', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
              
              {/* Header */}
              <div style={{ background: '#222222', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #333' }}>
                <span style={{ color: '#e5e7eb', fontWeight: 600, fontSize: '1rem' }}>{prompt.title}</span>
                <button 
                  onClick={() => handleCopy(prompt.text, prompt.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: copiedPromptId === prompt.id ? '#16a34a' : '#4b5563', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'background 0.2s' }}
                >
                  {copiedPromptId === prompt.id ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Prompt</>}
                </button>
              </div>

              {/* Text Block */}
              <div style={{ padding: '20px' }}>
                <pre style={{ margin: 0, color: '#a78bfa', fontFamily: 'monospace', fontSize: '1rem', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
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
