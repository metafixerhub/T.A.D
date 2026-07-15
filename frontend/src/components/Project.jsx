import React from 'react';
import { BookOpen, CheckCircle, Award, Target, Laptop } from 'lucide-react';

const Project = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', fontFamily: '"Outfit", sans-serif' }}>
      
      {/* Hero Banner */}
      <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', marginBottom: '40px', background: '#1e1e2f' }}>
        <img 
          src="/project-banner.png" 
          alt="Advance Coding Master Program" 
          style={{ width: '100%', height: '300px', objectFit: 'cover', opacity: 0.8 }} 
          onError={(e) => e.target.style.display = 'none'}
        />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px', background: 'linear-gradient(to top, rgba(15,23,42,1), rgba(15,23,42,0))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
            <Award size={36} color="#60a5fa" />
            <h1 style={{ margin: 0, fontSize: '2.5rem', color: 'white', fontWeight: 800, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              ADVANCE CODING MASTER PROGRAM
            </h1>
          </div>
          <p style={{ margin: 0, color: '#93c5fd', fontSize: '1.2rem', fontWeight: 500 }}>Final Assessment Scheme & Project Submission</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '40px' }}>
        
        {/* Total Marks Overview */}
        <div style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
            <Target size={24} color="#3b82f6" />
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1f2937' }}>Total Marks: 100</h2>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '15px 0', color: '#4b5563', fontWeight: 500 }}>Project Submission</td>
                <td style={{ padding: '15px 0', textAlign: 'right', fontWeight: 700, color: '#1f2937' }}>60 Marks</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '15px 0', color: '#4b5563', fontWeight: 500 }}>Practical Examination</td>
                <td style={{ padding: '15px 0', textAlign: 'right', fontWeight: 700, color: '#1f2937' }}>20 Marks</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '15px 0', color: '#4b5563', fontWeight: 500 }}>MCQ Examination (40 Qs)</td>
                <td style={{ padding: '15px 0', textAlign: 'right', fontWeight: 700, color: '#1f2937' }}>20 Marks</td>
              </tr>
              <tr>
                <td style={{ padding: '15px 0', color: '#2563eb', fontWeight: 800 }}>Total</td>
                <td style={{ padding: '15px 0', textAlign: 'right', fontWeight: 800, color: '#2563eb', fontSize: '1.1rem' }}>100 Marks</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Guidelines */}
        <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
            <BookOpen size={24} color="#4338ca" />
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#312e81' }}>Project Guidelines</h2>
          </div>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <CheckCircle size={20} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ color: '#374151', lineHeight: '1.5' }}>Submit the complete project files.</span>
            </li>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <CheckCircle size={20} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ color: '#374151', lineHeight: '1.5' }}>Include source code and required resources.</span>
            </li>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <CheckCircle size={20} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ color: '#374151', lineHeight: '1.5' }}>Include a short project report or documentation.</span>
            </li>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <CheckCircle size={20} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ color: '#374151', lineHeight: '1.5' }}>PPT presentation may be included with the project submission if required.</span>
            </li>
          </ul>

          <div style={{ marginTop: '30px', padding: '15px', background: 'rgba(255,255,255,0.6)', borderRadius: '8px', borderLeft: '4px solid #f59e0b', display: 'flex', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>🏆</span>
            <p style={{ margin: 0, color: '#92400e', fontWeight: 600, fontSize: '0.95rem', lineHeight: '1.4' }}>
              Students must successfully complete all three sections to receive certification.
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
        
        {/* Project Breakdown */}
        <div style={{ background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ background: '#dbeafe', padding: '8px', borderRadius: '8px' }}><Laptop size={20} color="#2563eb" /></div>
            <h3 style={{ margin: 0, color: '#1f2937' }}>1. Project (60 Marks)</h3>
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: '1.5' }}>
            <li>Idea & Creativity – <b style={{ color: '#111827' }}>15 Marks</b></li>
            <li>Design & UI – <b style={{ color: '#111827' }}>10 Marks</b></li>
            <li>Coding & Functionality – <b style={{ color: '#111827' }}>20 Marks</b></li>
            <li>Documentation & Explanation – <b style={{ color: '#111827' }}>10 Marks</b></li>
            <li>Presentation & Completion – <b style={{ color: '#111827' }}>5 Marks</b></li>
          </ul>
        </div>

        {/* Practical Breakdown */}
        <div style={{ background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ background: '#fef3c7', padding: '8px', borderRadius: '8px' }}><Award size={20} color="#d97706" /></div>
            <h3 style={{ margin: 0, color: '#1f2937' }}>2. Practical (20 Marks)</h3>
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: '1.5' }}>
            <li>One Practical Class Examination</li>
            <li>Code Execution</li>
            <li>Problem Solving</li>
            <li>Demonstration of Skills</li>
          </ul>
        </div>

        {/* MCQ Breakdown */}
        <div style={{ background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ background: '#dcfce3', padding: '8px', borderRadius: '8px' }}><CheckCircle size={20} color="#16a34a" /></div>
            <h3 style={{ margin: 0, color: '#1f2937' }}>3. MCQ Exam (20 Marks)</h3>
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: '1.5' }}>
            <li>Total Questions: <b style={{ color: '#111827' }}>40</b></li>
            <li>Marks per Question: <b style={{ color: '#111827' }}>0.5 Mark</b></li>
            <li>Calculation: <b style={{ color: '#111827' }}>20 ÷ 40 = 0.5</b></li>
            <li style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '10px', listStyle: 'none', marginLeft: '-20px' }}>
              <i>* No negative marking unless announced separately.</i>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Project;
