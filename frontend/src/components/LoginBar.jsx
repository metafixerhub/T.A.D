import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const LoginBar = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Successfully logged in!');
      onClose(); // Close modal on success
    } catch (err) {
      setError('Invalid email or password. Check Firebase Config.');
    }
    setLoading(false);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.7)', zIndex: 999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(5px)' }}>
      <div className="glass-card" style={{ position: 'relative', maxWidth: '400px', width: '100%', margin: '20px', textAlign: 'center', padding: '40px 30px' }}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(37, 99, 235, 0.1)', padding: '15px', borderRadius: '50%', color: '#2563eb' }}>
            <Lock size={32} />
          </div>
        </div>
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1f2937', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Login to Access</h3>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" 
            placeholder="Enter Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#ffffff', color: '#1f2937', width: '100%' }}
            required
          />
          <div style={{ position: 'relative', width: '100%' }}>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#ffffff', color: '#1f2937', width: '100%' }}
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '12px', width: '100%' }}>
            {loading ? 'LOGGING IN...' : 'LOGIN'}
          </button>
          
          {error && <div style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '10px' }}>{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default LoginBar;
