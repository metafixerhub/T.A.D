import React from 'react';
import { BookOpen, CheckCircle, Award, Target, Laptop, Database, Code, Users, Server, Shield, Globe } from 'lucide-react';

const Project = () => {
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px' }}>
        
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
    </div>
  );
};

export default Project;
