import React, { useState } from 'react';
import { Code, ExternalLink, AlertCircle } from 'lucide-react';

const VSCode = () => {
  const [iframeError, setIframeError] = useState(false);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* Header Bar */}
      <div style={{ padding: '15px 30px', background: 'white', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Code size={28} color="#2563eb" />
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#1f2937' }}>Online Code Editor</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280', fontWeight: 500 }}>Note: Use this for coding from online</p>
          </div>
        </div>
        
        <a 
          href="https://vscode.dev/" 
          target="_blank" 
          rel="noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#f3f4f6', color: '#374151', textDecoration: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.9rem', transition: 'background 0.2s' }}
          onMouseOver={e => e.currentTarget.style.background = '#e5e7eb'}
          onMouseOut={e => e.currentTarget.style.background = '#f3f4f6'}
        >
          <ExternalLink size={16} /> Open in New Tab
        </a>
      </div>

      {/* Launch Screen */}
      <div style={{ flex: 1, background: '#1e1e1e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center' }}>
        <div style={{ background: '#252526', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', maxWidth: '500px', border: '1px solid #333' }}>
          <Code size={64} color="#3b82f6" style={{ marginBottom: '20px' }} />
          <h3 style={{ margin: '0 0 15px 0', color: '#f3f4f6', fontSize: '1.5rem' }}>Launch VS Code</h3>
          <p style={{ margin: '0 0 25px 0', color: '#9ca3af', lineHeight: '1.6' }}>
            Microsoft's security settings prevent VS Code from being embedded directly inside other websites. 
            Click below to securely open your online editor in a new window.
          </p>
          <a 
            href="https://vscode.dev/" 
            target="_blank" 
            rel="noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '12px 24px', background: '#2563eb', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '1.1rem', transition: 'background 0.2s', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.3)' }}
            onMouseOver={e => e.currentTarget.style.background = '#1d4ed8'}
            onMouseOut={e => e.currentTarget.style.background = '#2563eb'}
          >
            <ExternalLink size={20} /> Launch VS Code Workspace
          </a>
        </div>
      </div>
      
    </div>
  );
};

export default VSCode;
