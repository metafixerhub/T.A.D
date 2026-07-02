import React, { useState, useEffect } from 'react';
import { 
  MonitorPlay, LayoutGrid, HelpCircle, FileText, Trophy, Award, 
  Bell, Gift, Flame, LogOut
} from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  // Role Selection State
  const [role, setRole] = useState(sessionStorage.getItem('userRole') || null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [roleError, setRoleError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (!role) {
          setShowRoleModal(true);
        }
      } else {
        // Not logged in, kick them out
        navigate('/');
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, [navigate, role]);

  const handleRoleSelect = (selectedRole) => {
    if (selectedRole === 'student') {
      sessionStorage.setItem('userRole', 'student');
      setRole('student');
      setShowRoleModal(false);
    } else {
      if (passcode === 'nur1438nur') {
        sessionStorage.setItem('userRole', 'teacher');
        setRole('teacher');
        setShowRoleModal(false);
      } else {
        setRoleError('Incorrect teacher passcode');
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userRole');
    signOut(auth);
  };

  if (loadingAuth) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  if (!user) return null; // Redirecting in useEffect

  const navLinks = [
    { name: 'Dashboard', icon: <LayoutGrid size={18} />, path: '/dashboard' },
    { name: 'Live Session', icon: <MonitorPlay size={18} />, path: '/dashboard/live' },
    { name: 'Practice', icon: <HelpCircle size={18} />, path: '/dashboard/practice' },
    { name: 'Materials', icon: <FileText size={18} />, path: '/dashboard/materials' },
    { name: 'Leaderboard', icon: <Trophy size={18} />, path: '/dashboard/leaderboard' },
    { name: 'Certificate', icon: <Award size={18} />, path: '/dashboard/certificate' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#f9fafb', fontFamily: '"Inter", sans-serif', overflow: 'hidden' }}>
      
      {/* ROLE SELECTION MODAL */}
      {showRoleModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '16px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#1f2937' }}>Welcome! Are you a...</h2>
            
            <button onClick={() => handleRoleSelect('student')} style={{ width: '100%', padding: '15px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', marginBottom: '20px' }}>
              Student
            </button>
            
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
              <p style={{ margin: '0 0 10px 0', color: '#6b7280', fontSize: '0.9rem' }}>Teacher Access</p>
              <input 
                type="password" 
                placeholder="Enter Teacher Passcode" 
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', marginBottom: '10px' }}
              />
              {roleError && <p style={{ color: 'red', fontSize: '0.8rem', margin: '0 0 10px 0' }}>{roleError}</p>}
              <button onClick={() => handleRoleSelect('teacher')} style={{ width: '100%', padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>
                Enter as Teacher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEFT SIDEBAR */}
      <aside style={{ width: '250px', background: 'white', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '30px', width: '30px', objectFit: 'contain' }} onError={e => e.target.style.display='none'} />
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1f2937' }}>TRAINING HUB</span>
        </div>
        
        <div style={{ padding: '15px 0', flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '0 20px', fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', marginBottom: '10px' }}>LEARNING MENU</div>
          {navLinks.map(link => {
            const isActive = location.pathname === link.path;
            return (
              <Link to={link.path} key={link.name} style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', background: isActive ? '#eef2ff' : 'transparent', color: isActive ? '#4f46e5' : '#4b5563', borderRight: isActive ? '3px solid #4f46e5' : '3px solid transparent', textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: isActive ? 600 : 500 }}>
                  {link.icon} {link.name}
                </div>
              </Link>
            )
          })}
        </div>

        {/* User Role Badge in Sidebar */}
        <div style={{ padding: '20px', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>ROLE</p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#1f2937', fontWeight: 700, textTransform: 'uppercase' }}>{role || 'Not Set'}</p>
            </div>
            <LogOut size={20} color="#ef4444" style={{ cursor: 'pointer' }} onClick={handleLogout} />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* TOP HEADER */}
        <header style={{ height: '70px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', borderBottom: '1px solid #e5e7eb', zIndex: 10 }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#1f2937', fontWeight: 600 }}>
            {navLinks.find(l => l.path === location.pathname)?.name || 'Dashboard'}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Gift size={22} color="#f59e0b" style={{ cursor: 'pointer' }} />
            <Bell size={22} color="#4b5563" style={{ cursor: 'pointer' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f3f4f6', padding: '5px 15px 5px 5px', borderRadius: '30px' }}>
              <div style={{ height: '32px', width: '32px', borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1rem' }}>
                {user.email.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                {user.email.split('@')[0]}
              </span>
            </div>
          </div>
        </header>

        {/* NESTED CONTENT OUTLET */}
        <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
          <Outlet />
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
