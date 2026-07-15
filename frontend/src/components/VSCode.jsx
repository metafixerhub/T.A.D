import React, { useState, useRef } from 'react';
import { Code, Play, Terminal, Monitor, LayoutTemplate } from 'lucide-react';
import Editor from '@monaco-editor/react';

const CodeEditor = () => {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('print("Hello World!")');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  
  // Ref for the HTML/CSS/JS preview
  const iframeRef = useRef(null);

  const runCode = async () => {
    if (language === 'html') {
      // For HTML, just update the iframe
      const iframe = iframeRef.current;
      if (iframe) {
        iframe.srcdoc = code;
      }
      return;
    }

    setIsRunning(true);
    setOutput('Running code...');

    try {
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: language === 'javascript' ? 'node' : language,
          version: '*',
          files: [{ content: code }]
        })
      });

      const result = await response.json();
      
      if (result.compile && result.compile.code !== 0) {
        setOutput(result.compile.output);
      } else if (result.run) {
        setOutput(result.run.output || 'Code executed successfully with no output.');
      } else {
        setOutput(result.message || 'Error executing code.');
      }
    } catch (err) {
      setOutput('Failed to connect to execution server.\n' + err.message);
    }
    
    setIsRunning(false);
  };

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    if (lang === 'python') {
      setCode('print("Hello World!")');
    } else if (lang === 'javascript') {
      setCode('console.log("Hello Node.js!");');
    } else if (lang === 'html') {
      setCode(`<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; text-align: center; margin-top: 50px; }
    h1 { color: #3b82f6; }
  </style>
</head>
<body>
  <h1>Hello Web!</h1>
  <p>Edit HTML, CSS, and JS here.</p>
</body>
</html>`);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#1e1e1e' }}>
      
      {/* Header Toolbar */}
      <div style={{ padding: '10px 20px', background: '#252526', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Code size={24} color="#3b82f6" />
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#e5e7eb' }}>Code Editor</h2>
          
          <select 
            value={language} 
            onChange={handleLanguageChange}
            style={{ background: '#3c3c3c', color: '#e5e7eb', border: '1px solid #555', padding: '6px 12px', borderRadius: '4px', marginLeft: '20px', cursor: 'pointer', outline: 'none' }}
          >
            <option value="python">Python</option>
            <option value="javascript">Node.js (JS)</option>
            <option value="html">HTML/CSS/JS (Web)</option>
          </select>
        </div>
        
        <button 
          onClick={runCode}
          disabled={isRunning}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px', background: isRunning ? '#374151' : '#22c55e', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: isRunning ? 'default' : 'pointer', transition: 'background 0.2s' }}
        >
          <Play size={16} fill="white" />
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
      </div>

      {/* Editor & Output Split */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* Monaco Editor (Left) */}
        <div style={{ flex: 1, borderRight: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '8px 15px', background: '#252526', color: '#9ca3af', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid #333' }}>
            main.{language === 'python' ? 'py' : language === 'javascript' ? 'js' : 'html'}
          </div>
          <div style={{ flex: 1 }}>
            <Editor
              height="100%"
              theme="vs-dark"
              language={language === 'html' ? 'html' : language}
              value={code}
              onChange={(val) => setCode(val)}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                padding: { top: 15 }
              }}
            />
          </div>
        </div>

        {/* Output/Preview Panel (Right) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: language === 'html' ? 'white' : '#1e1e1e' }}>
          <div style={{ padding: '8px 15px', background: '#252526', color: '#9ca3af', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {language === 'html' ? <><Monitor size={16} /> Live Preview</> : <><Terminal size={16} /> Terminal Output</>}
          </div>
          
          <div style={{ flex: 1, position: 'relative' }}>
            {language === 'html' ? (
              <iframe
                ref={iframeRef}
                title="preview"
                style={{ width: '100%', height: '100%', border: 'none' }}
                sandbox="allow-scripts"
                srcDoc={code}
              />
            ) : (
              <pre style={{ margin: 0, padding: '15px', color: '#e5e7eb', fontFamily: 'monospace', fontSize: '0.9rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all', height: '100%', overflowY: 'auto' }}>
                {output || 'Output will appear here...'}
              </pre>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CodeEditor;
