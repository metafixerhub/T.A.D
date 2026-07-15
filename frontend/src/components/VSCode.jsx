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

      {/* Editor Frame */}
      <div style={{ flex: 1, position: 'relative', background: '#1e1e1e' }}>
        {iframeError ? (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px', textAlign: 'center', color: '#9ca3af' }}>
            <AlertCircle size={48} color="#4b5563" style={{ marginBottom: '15px' }} />
            <h3 style={{ margin: '0 0 10px 0', color: '#f3f4f6' }}>VS Code cannot be embedded</h3>
            <p style={{ margin: '0 0 20px 0', maxWidth: '400px', lineHeight: '1.5' }}>
              Microsoft blocks vscode.dev from loading inside an iframe on other websites for security reasons.
            </p>
            <a 
              href="https://vscode.dev/" 
              target="_blank" 
              rel="noreferrer"
              style={{ padding: '10px 20px', background: '#2563eb', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: 600 }}
            >
              Open VS Code in a New Tab
            </a>
          </div>
        ) : (
          <iframe 
            src="https://vscode.dev/" 
            title="VS Code Online"
            style={{ width: '100%', height: '100%', border: 'none' }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            onError={() => setIframeError(true)}
            // We use onLoad to theoretically catch errors, though CSP errors won't trigger standard JS errors, 
            // the user will see the fallback button anyway if it stays blank.
          />
        )}
      </div>
      
    </div>
  );
};

export default VSCode;
