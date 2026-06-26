import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const LoginBar = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Successfully logged in!');
    } catch (err) {
      setError('Invalid email or password. Check Firebase Config.');
    }
    setLoading(false);
  };

  return (
    <section className="container" style={{ padding: '0 20px', marginTop: '-30px', position: 'relative', zIndex: 10 }}>
      <div className="glass-card" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px', border: '1px solid rgba(30, 136, 229, 0.5)', background: 'rgba(0, 20, 40, 0.8)' }}>
        
        {/* Left Side: Text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(30, 136, 229, 0.2)', padding: '15px', borderRadius: '12px', color: '#1e88e5' }}>
            <Lock size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>Access All Recordings</h3>
            <p style={{ margin: 0, color: '#b0c4de', fontSize: '0.9rem' }}>Login to access course recordings, materials & premium content.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', gap: '15px', flexGrow: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <input 
            type="email" 
            placeholder="Enter Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(0, 0, 0, 0.5)', color: 'white', flexGrow: 1, maxWidth: '250px' }}
            required
          />
          <div style={{ position: 'relative', flexGrow: 1, maxWidth: '250px' }}>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(0, 0, 0, 0.5)', color: 'white', width: '100%' }}
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#b0c4de', cursor: 'pointer' }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '12px 40px' }}>
              {loading ? 'LOGGING IN...' : 'LOGIN'}
            </button>
            <span style={{ fontSize: '0.75rem', color: '#b0c4de', textAlign: 'center', cursor: 'pointer' }}>Forgot Password?</span>
          </div>
        </form>

        {error && <div style={{ width: '100%', color: '#ff4444', fontSize: '0.9rem', textAlign: 'right', marginTop: '-10px' }}>{error}</div>}
      </div>
    </section>
  );
};

export default LoginBar;
