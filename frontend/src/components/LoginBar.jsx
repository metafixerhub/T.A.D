import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X, User, Info, ArrowRight } from 'lucide-react';
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
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(10px)' }}>
      
      {/* Outer Glow */}
      <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }}></div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '450px', width: '90%', margin: '20px', padding: '50px 40px', background: 'rgba(20, 20, 30, 0.7)', backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(25px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', borderRadius: '24px', color: 'white', fontFamily: '"Outfit", sans-serif' }}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#cbd5e1', cursor: 'pointer', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.2)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
          <X size={20} />
        </button>

        <h2 style={{ margin: 0, fontSize: '2.5rem', color: '#ffffff', fontWeight: 700, marginBottom: '10px', textAlign: 'center', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>Welcome Back</h2>
        <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '40px', fontSize: '1rem' }}>Enter your credentials to access the portal.</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', transition: 'border-color 0.2s' }}>
            <User size={22} color="#8b5cf6" style={{ marginRight: '15px' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</span>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '1.1rem', color: '#ffffff', width: '100%' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 16px', marginBottom: '30px', transition: 'border-color 0.2s' }}>
            <Lock size={22} color="#3b82f6" style={{ marginRight: '15px' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</span>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '1.1rem', color: '#ffffff', width: '100%' }}
                required
              />
            </div>
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, marginLeft: '10px' }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 10px 20px rgba(99,102,241,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
            {loading ? 'Authenticating...' : <>Sign in <ArrowRight size={18} /></>}
          </button>
          
          {error && <div style={{ color: '#f87171', fontSize: '0.9rem', marginTop: '15px', textAlign: 'center', background: 'rgba(248,113,113,0.1)', padding: '10px', borderRadius: '8px' }}>{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default LoginBar;
