import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X, User, Info } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const LoginBar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
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
      onClose(); // Close modal on success
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password. Check Firebase Config.');
    }
    setLoading(false);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.7)', zIndex: 999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(5px)' }}>
      <div className="glass-card" style={{ position: 'relative', maxWidth: '450px', width: '100%', margin: '20px', textAlign: 'center', padding: '50px 40px', background: '#ffffff', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', borderRadius: '12px' }}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        <h2 style={{ margin: 0, fontSize: '2.5rem', color: '#334155', fontWeight: 500, marginBottom: '40px' }}>Sign in</h2>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #94a3b8', paddingBottom: '8px', marginBottom: '30px' }}>
            <User size={24} color="#64748b" style={{ marginRight: '20px', marginTop: '15px' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>Username</span>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '1.1rem', color: '#0f172a', padding: '4px 0', width: '100%' }}
                required
              />
            </div>
            <Info size={20} color="#64748b" style={{ marginLeft: '10px', marginTop: '15px' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #94a3b8', paddingBottom: '8px', marginBottom: '40px' }}>
            <Lock size={24} color="#64748b" style={{ marginRight: '20px', marginTop: '15px' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>Password</span>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '1.1rem', color: '#0f172a', padding: '4px 0', width: '100%' }}
                required
              />
            </div>
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0, marginLeft: '10px', marginTop: '15px' }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          <button type="submit" disabled={loading} style={{ background: '#1e3a8a', color: 'white', border: 'none', padding: '16px', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s ease', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          
          {error && <div style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '15px' }}>{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default LoginBar;
