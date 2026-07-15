import React, { useState, useEffect } from 'react';
import { 
  MonitorPlay, LayoutGrid, HelpCircle, FileText, Trophy, 
  Bell, Gift, LogOut, Menu, X, Award
} from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  // Mobile Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Role Selection State
  const [role, setRole] = useState(sessionStorage.getItem('userRole') || 'student');

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Default to student if no role is set
        if (!sessionStorage.getItem('userRole')) {
          sessionStorage.setItem('userRole', 'student');
          setRole('student');
        }
      } else {
        navigate('/');
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, [navigate]);

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
    { name: 'Final Project', icon: <Award size={18} />, path: '/dashboard/project' },
    { name: 'Leaderboard', icon: <Trophy size={18} />, path: '/dashboard/leaderboard' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#f9fafb', fontFamily: '"Outfit", sans-serif', overflow: 'hidden' }}>
      
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="show-mobile"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }}
        />
      )}

      {/* LEFT SIDEBAR */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`} style={{ background: 'white', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.png" alt="Logo" style={{ height: '30px', width: '30px', objectFit: 'contain' }} onError={e => e.target.style.display='none'} />
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1f2937' }}>TRAINING HUB</span>
          </div>
          <X className="show-mobile" size={24} color="#6b7280" style={{ cursor: 'pointer' }} onClick={() => setIsSidebarOpen(false)} />
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
        <header className="mobile-padding glass-nav" style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Menu className="show-mobile" size={26} color="#1f2937" style={{ cursor: 'pointer' }} onClick={() => setIsSidebarOpen(true)} />
            <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#1f2937', fontWeight: 600 }}>
              {navLinks.find(l => l.path === location.pathname)?.name || 'Dashboard'}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Gift size={22} color="#f59e0b" style={{ cursor: 'pointer' }} />
            <Bell size={22} color="#4b5563" style={{ cursor: 'pointer' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(243, 244, 246, 0.8)', padding: '5px 15px 5px 5px', borderRadius: '30px' }}>
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
