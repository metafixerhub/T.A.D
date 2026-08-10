import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Code, Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : 'https://t-a-d.onrender.com/api');

const HalloG = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hallog_messages')) || [{
        role: 'assistant',
        content: "Hi! I'm Hallo G, your AI Web Academy teaching assistant. How can I help you learn today?"
      }];
    } catch {
      return [{
        role: 'assistant',
        content: "Hi! I'm Hallo G, your AI Web Academy teaching assistant. How can I help you learn today?"
      }];
    }
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('hallog_messages', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (text) => {
    if (!text.trim()) return;
    
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });
      
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      
      setMessages([...newMessages, { role: 'assistant', content: data.message }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'assistant', content: "**Error:** I'm having trouble connecting to my servers right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if(window.confirm('Clear conversation history?')) {
      setMessages([{
        role: 'assistant',
        content: "Hi! I'm Hallo G, your AI Web Academy teaching assistant. How can I help you learn today?"
      }]);
    }
  };

  const quickReplies = [
    "Explain this code to me",
    "Help me debug",
    "What should I learn next?",
    "Quiz me on HTML"
  ];

  const formatText = (text) => {
    // Basic formatting for code blocks and bold text since we don't have react-markdown installed.
    const parts = text.split('```');
    return parts.map((part, index) => {
      if (index % 2 !== 0) {
        return (
          <div key={index} style={{ background: '#0f172a', padding: '10px', borderRadius: '6px', margin: '8px 0', overflowX: 'auto', fontFamily: 'monospace', fontSize: '0.85rem', color: '#38bdf8', border: '1px solid rgba(255,255,255,0.1)' }}>
            <pre style={{ margin: 0 }}><code>{part.replace(/^[\w-]+\n/, '')}</code></pre>
          </div>
        );
      }
      
      return <span key={index}>{part.split('**').map((boldPart, i) => i % 2 !== 0 ? <strong key={i} style={{ color: '#fff' }}>{boldPart}</strong> : boldPart)}</span>;
    });
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed', bottom: '30px', right: '30px', width: '60px', height: '60px',
          borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #14b8a6)',
          color: 'white', border: 'none', boxShadow: '0 10px 25px rgba(59,130,246,0.4)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, transition: 'transform 0.3s'
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Sparkles size={28} />
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed', bottom: '30px', right: '30px', width: '380px', height: '600px', maxHeight: '85vh',
      background: '#1e293b', borderRadius: '20px', display: 'flex', flexDirection: 'column',
      boxShadow: '0 15px 50px rgba(0,0,0,0.5)', zIndex: 9999, overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '50%' }}>
            <Bot size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>Chat with Hallo G</h3>
            <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Online • AI Teaching Assistant</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={clearChat} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}><Trash2 size={18} /></button>
          <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
            {msg.role === 'assistant' && (
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <Bot size={16} />
              </div>
            )}
            <div style={{
              background: msg.role === 'user' ? '#3b82f6' : 'rgba(255,255,255,0.05)',
              color: msg.role === 'user' ? 'white' : '#e2e8f0',
              padding: '12px 16px', borderRadius: '16px',
              borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
              borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '16px',
              fontSize: '0.9rem', lineHeight: '1.5', wordBreak: 'break-word', whiteSpace: 'pre-wrap'
            }}>
              {formatText(msg.content)}
            </div>
            {msg.role === 'user' && (
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <User size={16} />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', gap: '10px', alignSelf: 'flex-start', maxWidth: '85%' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
              <Bot size={16} />
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px 16px', borderRadius: '16px', borderBottomLeftRadius: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span className="dot-flashing" style={{ letterSpacing: '2px' }}>•••</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies (only show if no user messages yet or just 1 message) */}
      {messages.length < 3 && (
        <div style={{ padding: '0 20px 10px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {quickReplies.map((reply, i) => (
            <button key={i} onClick={() => handleSend(reply)} style={{
              background: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6',
              padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', cursor: 'pointer',
              transition: 'background 0.2s'
            }} onMouseOver={e => e.currentTarget.style.background = 'rgba(59,130,246,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div style={{ padding: '15px 20px', borderTop: '1px solid rgba(255,255,255,0.1)', background: '#1e293b' }}>
        <form onSubmit={e => { e.preventDefault(); handleSend(input); }} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            value={input} 
            onChange={e => setInput(e.target.value)}
            placeholder="Ask Hallo G anything..."
            disabled={isLoading}
            style={{
              flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
              padding: '12px 15px', borderRadius: '20px', color: 'white', outline: 'none'
            }}
          />
          <button type="submit" disabled={!input.trim() || isLoading} style={{
            background: input.trim() && !isLoading ? '#3b82f6' : 'rgba(255,255,255,0.1)',
            color: 'white', border: 'none', width: '42px', height: '42px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
            transition: 'background 0.3s'
          }}>
            <Send size={18} style={{ marginLeft: '2px' }} />
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.65rem', color: '#64748b' }}>
          Powered by <strong>AI Web Academy</strong>
        </div>
      </div>
    </div>
  );
};

export default HalloG;
