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
    <section className="container" style={{ display: 'flex', justifyContent: 'center', paddingBottom: '100px', marginTop: '-40px' }}>
      <div className="glass-card" style={{ maxWidth: '400px', width: '100%', border: '1px solid rgba(30, 136, 229, 0.5)', background: 'rgba(0, 20, 40, 0.8)', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(30, 136, 229, 0.2)', padding: '15px', borderRadius: '50%', color: '#1e88e5' }}>
            <Lock size={32} />
          </div>
        </div>
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Login to Access</h3>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" 
            placeholder="Enter Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(0, 0, 0, 0.5)', color: 'white', width: '100%' }}
            required
          />
          <div style={{ position: 'relative', width: '100%' }}>
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
          
          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '12px', width: '100%' }}>
            {loading ? 'LOGGING IN...' : 'LOGIN'}
          </button>
          
          {error && <div style={{ color: '#ff4444', fontSize: '0.9rem', marginTop: '10px' }}>{error}</div>}
        </form>
      </div>
    </section>
  );
};

export default LoginBar;
