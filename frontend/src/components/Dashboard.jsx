import React, { useState, useEffect } from 'react';
import { 
  MonitorPlay, LayoutGrid, HelpCircle, FileText, Trophy, 
  Bell, Gift, LogOut, Menu, X, Award, ShieldAlert, Video, Info
} from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { auth, database } from '../firebaseConfig';
import { formatDistanceToNow } from 'date-fns';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [role, setRole] = useState(sessionStorage.getItem('userRole') || 'student');

  // Global State
  const [liveStatus, setLiveStatus] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readNotifs, setReadNotifs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('readNotifs') || '[]'); } catch(e) { return []; }
  });
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
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

  // Listen for Global Live Status & Notifications
  useEffect(() => {
    const liveRef = ref(database, 'live_status/isLive');
    const unsubLive = onValue(liveRef, (snapshot) => {
      setLiveStatus(!!snapshot.val());
    });

    const notifRef = ref(database, 'notifications');
    const unsubNotif = onValue(notifRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const notifs = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setNotifications(notifs.sort((a, b) => b.timestamp - a.timestamp));
      } else {
        setNotifications([]);
      }
    });

    return () => {
      unsubLive();
      unsubNotif();
    };
  }, []);

  const markAsRead = (id) => {
    const newRead = [...readNotifs, id];
    setReadNotifs(newRead);
    localStorage.setItem('readNotifs', JSON.stringify(newRead));
  };
  
  const unreadCount = notifications.filter(n => !readNotifs.includes(n.id)).length;

  const handleLogout = () => {
    sessionStorage.removeItem('userRole');
    signOut(auth);
  };

  if (loadingAuth) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: 'white' }}>Loading System...</div>;
  }

  if (!user) return null;

  const navLinks = [
    { name: 'Dashboard', icon: <LayoutGrid size={18} />, path: '/dashboard' },
    { name: 'Live Session', icon: <MonitorPlay size={18} />, path: '/dashboard/live' },
    { name: 'Story Corner', icon: <Award size={18} />, path: '/dashboard/story-corner' },
    { name: 'DNA', icon: <HelpCircle size={18} />, path: '/dashboard/dna' },
    { name: 'Final Project', icon: <Award size={18} />, path: '/dashboard/project' },
    { name: 'Leaderboard', icon: <Trophy size={18} />, path: '/dashboard/leaderboard' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#0f172a', fontFamily: '"Outfit", sans-serif', overflow: 'hidden' }}>
      
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="show-mobile"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }}
        />
      )}

      {/* LEFT SIDEBAR (Premium Dark Theme) */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`} style={{ background: 'rgba(30, 41, 59, 0.95)', backdropFilter: 'blur(10px)', borderRight: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.png" alt="Logo" style={{ height: '30px', width: '30px', objectFit: 'contain' }} onError={e => e.target.style.display='none'} />
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#ffffff', letterSpacing: '1px' }}>EDUVERSE</span>
          </div>
          <X className="show-mobile" size={24} color="#94a3b8" style={{ cursor: 'pointer' }} onClick={() => setIsSidebarOpen(false)} />
        </div>
        
        <div style={{ padding: '20px 0', flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '0 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Menu</div>
          {navLinks.map(link => {
            const isActive = location.pathname === link.path;
            return (
              <Link to={link.path} key={link.name} style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', background: isActive ? 'linear-gradient(90deg, rgba(59,130,246,0.1) 0%, transparent 100%)' : 'transparent', color: isActive ? '#60a5fa' : '#94a3b8', borderRight: isActive ? '3px solid #3b82f6' : '3px solid transparent', textDecoration: 'none', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: isActive ? 600 : 500 }}>
                  {link.icon} {link.name}
                </div>
              </Link>
            )
          })}
        </div>

        {/* User Role & Secret Admin Access Button */}
        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: 700, letterSpacing: '1px' }}>ROLE</p>
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#e2e8f0', fontWeight: 700, textTransform: 'uppercase' }}>{role}</p>
            </div>
            <LogOut size={20} color="#ef4444" style={{ cursor: 'pointer' }} onClick={handleLogout} />
          </div>
          <button onClick={() => navigate('/dashboard/admin')} style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#94a3b8', fontSize: '0.8rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <ShieldAlert size={14} /> Admin Access
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        
        {/* REMOVED OLD ADMIN NOTIFICATION */}

        {/* GLOBAL LIVE CLASS BANNER */}
        {liveStatus && location.pathname !== '/dashboard/live' && (
          <div style={{ background: '#ef4444', color: 'white', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: 600, fontSize: '0.95rem', zIndex: 50, boxShadow: '0 4px 10px rgba(239, 68, 68, 0.4)' }}>
            <span style={{ height: '10px', width: '10px', background: 'white', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span>
            🔴 LIVE CLASS IS GOING ON! 
            <button onClick={() => navigate('/dashboard/live')} style={{ background: 'white', color: '#ef4444', border: 'none', padding: '4px 12px', borderRadius: '15px', fontWeight: 700, marginLeft: '10px', cursor: 'pointer' }}>Join Now</button>
          </div>
        )}

        {/* TOP HEADER */}
        <header className="mobile-padding" style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', zIndex: 10, background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Menu className="show-mobile" size={26} color="#e2e8f0" style={{ cursor: 'pointer' }} onClick={() => setIsSidebarOpen(true)} />
            <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc', fontWeight: 600 }}>
              {navLinks.find(l => l.path === location.pathname)?.name || 'Dashboard'}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Gift size={22} color="#f59e0b" style={{ cursor: 'pointer' }} />
            
            {/* NOTIFICATION BELL */}
            <div style={{ position: 'relative' }}>
              <div onClick={() => setShowNotifMenu(!showNotifMenu)} style={{ cursor: 'pointer', position: 'relative' }}>
                <Bell size={22} color={unreadCount > 0 ? '#f8fafc' : '#94a3b8'} />
                {unreadCount > 0 && (
                  <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '2px 5px', borderRadius: '10px', border: '2px solid #0f172a' }}>
                    {unreadCount}
                  </span>
                )}
              </div>
              
              {/* NOTIFICATION DROPDOWN */}
              {showNotifMenu && (
                <div style={{ position: 'absolute', top: '40px', right: '0', width: '320px', background: 'rgba(30,41,59,0.98)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', zIndex: 100, overflow: 'hidden' }}>
                  <div style={{ padding: '15px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontWeight: 700, color: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Notifications
                    {unreadCount > 0 && <span style={{ fontSize: '0.75rem', background: '#3b82f6', padding: '2px 8px', borderRadius: '10px' }}>{unreadCount} New</span>}
                  </div>
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {notifications.length === 0 && <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>No notifications yet.</div>}
                    {notifications.map(notif => {
                      const isRead = readNotifs.includes(notif.id);
                      return (
                        <div key={notif.id} style={{ padding: '15px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: isRead ? 'transparent' : 'rgba(59,130,246,0.1)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.75rem', color: isRead ? '#64748b' : '#3b82f6', fontWeight: 600 }}>
                              {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                            </span>
                            {!isRead && (
                              <button onClick={() => markAsRead(notif.id)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}>Mark as read</button>
                            )}
                          </div>
                          {notif.imageUrl && <img src={notif.imageUrl} alt="Alert" style={{ width: '100%', borderRadius: '6px', marginBottom: '10px', maxHeight: '120px', objectFit: 'cover' }} />}
                          <div style={{ fontSize: '0.9rem', color: isRead ? '#94a3b8' : '#e2e8f0', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                            {notif.text}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.1)', padding: '5px 15px 5px 5px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ height: '32px', width: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1rem' }}>
                {user.email.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}>
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
