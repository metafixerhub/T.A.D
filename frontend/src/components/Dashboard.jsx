import React from 'react';
import { 
  MonitorPlay, LayoutGrid, Clock, BookOpen, GraduationCap, Compass, HelpCircle, 
  BookMarked, History, Sword, Search, Bell, Gift, Flame, PlayCircle, MoreVertical, X, Lock, Circle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  
  // Sidebar Links Data
  const navLinks = [
    { name: 'Study', icon: <MonitorPlay size={18} />, active: true },
    { name: 'Pi', icon: <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>π</span>, isNew: true },
    { name: 'Batches', icon: <MonitorPlay size={18} /> },
    { name: 'Curious Jr', icon: <GraduationCap size={18} /> },
    { name: 'Test Series', icon: <LayoutGrid size={18} /> },
    { name: 'My Test', icon: <LayoutGrid size={18} /> },
    { name: 'Scholarship', icon: <GraduationCap size={18} /> },
    { name: 'Explore PW', icon: <Compass size={18} /> },
  ];

  const studyZone = [
    { title: 'My Batches', desc: 'View list of batches in which you are ...', icon: <MonitorPlay size={24} color="#3b82f6" /> },
    { title: 'Dashboard', desc: 'Track your progress through detailed ...', icon: <LayoutGrid size={24} color="#10b981" /> },
    { title: 'Library', desc: 'Access all your free material here', icon: <BookOpen size={24} color="#8b5cf6" /> },
    { title: 'My History', desc: 'View your recent learning here', icon: <History size={24} color="#64748b" /> },
    { title: 'Bookmarks', desc: 'View the list of your saved questions', icon: <BookMarked size={24} color="#f59e0b" /> },
    { title: 'Battlegrounds', desc: 'View all your live battlegrounds here', icon: <Sword size={24} color="#ef4444" /> },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#f9fafb', fontFamily: '"Inter", sans-serif', overflow: 'hidden' }}>
      
      {/* LEFT SIDEBAR */}
      <aside style={{ width: '250px', background: 'white', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '30px', width: '30px', objectFit: 'contain' }} onError={e => e.target.style.display='none'} />
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1f2937' }}>TRAINING HUB</span>
        </div>
        
        <div style={{ padding: '15px 0', flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '0 20px', fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', marginBottom: '10px' }}>LEARN ONLINE</div>
          {navLinks.slice(0,2).map(link => (
            <div key={link.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: link.active ? '#eef2ff' : 'transparent', color: link.active ? '#4f46e5' : '#4b5563', borderRight: link.active ? '3px solid #4f46e5' : '3px solid transparent', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: link.active ? 600 : 500 }}>
                {link.icon} {link.name}
              </div>
              {link.isNew && <span style={{ background: '#ef4444', color: 'white', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>NEW</span>}
            </div>
          ))}

          <div style={{ padding: '20px 20px 10px 20px', fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af' }}>STUDY PACKS</div>
          {navLinks.slice(2,7).map(link => (
            <div key={link.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', color: '#4b5563', cursor: 'pointer', fontWeight: 500 }}>
              {link.icon} {link.name}
            </div>
          ))}

          <div style={{ padding: '20px 20px 10px 20px', fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af' }}>EXPLORE PW</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', color: '#4b5563', cursor: 'pointer', fontWeight: 500 }}>
            {navLinks[7].icon} {navLinks[7].name}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* TOP HEADER */}
        <header style={{ height: '70px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#1f2937', fontWeight: 600 }}>Study</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Gift size={22} color="#f59e0b" style={{ cursor: 'pointer' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#f3f4f6', padding: '5px 10px', borderRadius: '20px' }}>
              <Flame size={16} color="#ef4444" /> <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>0</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#f3f4f6', padding: '5px 10px', borderRadius: '20px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.7rem', color: '#4b5563', background: '#d1d5db', padding: '2px 4px', borderRadius: '4px' }}>XP</span> 
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>0</span>
            </div>
            <Bell size={22} color="#4b5563" style={{ cursor: 'pointer' }} />
            <div style={{ height: '35px', width: '35px', borderRadius: '50%', background: '#f59e0b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }}>
              N
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '30px', position: 'relative' }}>
          
          {/* Hero Banner */}
          <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', borderRadius: '16px', padding: '40px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', marginBottom: '40px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: '-10%', top: '-50%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }}></div>
            <div>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, letterSpacing: '1px' }}>YOUR BATCH</p>
              <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '15px' }}>
                Junoon 2027 (...) 
                <span style={{ fontSize: '1rem', cursor: 'pointer' }}>▼</span>
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', zIndex: 1 }}>
              <button style={{ background: 'white', color: '#1f2937', border: 'none', padding: '12px 24px', borderRadius: '24px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                UPGRADE <span style={{ color: '#f59e0b' }}>PLAN</span>
              </button>
              <MoreVertical size={24} color="white" style={{ cursor: 'pointer' }} />
            </div>
          </div>

          {/* Batch Offerings */}
          <section style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#1f2937', marginBottom: '20px' }}>Batch Offerings</h3>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {[
                { title: 'All Classes', icon: <BookOpen size={20} color="#3b82f6" /> },
                { title: 'All Tests', icon: <LayoutGrid size={20} color="#6366f1" /> },
                { title: 'My Doubts', icon: <HelpCircle size={20} color="#8b5cf6" /> },
                { title: 'Saarthi', icon: <Lock size={20} color="#f59e0b" /> },
                { title: 'Khazana', icon: <Lock size={20} color="#f59e0b" /> },
              ].map(offer => (
                <div key={offer.title} style={{ background: 'white', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', cursor: 'pointer', border: '1px solid #f1f5f9', boxShadow: '0 2px 5px rgba(0,0,0,0.02)', flex: 1, minWidth: '180px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600, color: '#334155' }}>
                    <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '8px' }}>{offer.icon}</div>
                    {offer.title}
                  </div>
                  <span style={{ color: '#cbd5e1' }}>›</span>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming Events */}
          <section style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#1f2937', marginBottom: '20px' }}>Upcoming Events</h3>
            <div style={{ background: 'white', borderRadius: '16px', padding: '40px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'inline-block', marginBottom: '20px' }}>
                <Circle size={60} color="#bfdbfe" fill="#e0e7ff" strokeWidth={1} />
                <Clock size={40} color="#3b82f6" style={{ position: 'absolute', transform: 'translate(-50%, -50%)', marginTop: '-30px', marginLeft: '30px' }} />
              </div>
              <h4 style={{ margin: '0 0 10px 0', color: '#1f2937', fontSize: '1.1rem' }}>No upcoming events,</h4>
              <p style={{ margin: '0 0 30px 0', color: '#64748b', fontSize: '0.9rem' }}>Perfect time to catch up on pending work!</p>
              <button style={{ background: 'white', color: '#4f46e5', border: '1px solid #4f46e5', padding: '10px 24px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                View Weekly Schedule
              </button>
            </div>
          </section>

          {/* My Study Zone */}
          <section style={{ paddingBottom: '100px' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#1f2937', marginBottom: '20px' }}>My Study Zone</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {studyZone.map(zone => (
                <div key={zone.title} style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                     onMouseOver={e => e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.05)'}
                     onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}>
                  <div style={{ marginBottom: '15px' }}>{zone.icon}</div>
                  <h4 style={{ margin: '0 0 8px 0', color: '#1f2937', fontSize: '1.1rem' }}>{zone.title}</h4>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>{zone.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Floating Resume Widget */}
          <div style={{ position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100 }}>
            <PlayCircle size={30} color="#d97706" />
            <div>
              <h4 style={{ margin: 0, color: '#1f2937', fontSize: '0.9rem' }}>Arithmetic Expressions 01 : Simple Expres...</h4>
              <p style={{ margin: 0, color: '#92400e', fontSize: '0.8rem' }}>sion || Reading And Writing Complex Ex...</p>
            </div>
            <button style={{ background: '#1f2937', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Resume</button>
            <X size={20} color="#6b7280" style={{ cursor: 'pointer' }} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
