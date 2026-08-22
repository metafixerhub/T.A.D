import React, { useState, useEffect } from 'react';
import { MonitorPlay, HelpCircle, FileText, Trophy, Award, ChevronLeft, ChevronRight, Video, Calendar as CalIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { ref, onValue } from 'firebase/database';
import { auth, firestore, database } from '../firebaseConfig';
import { formatDistanceToNow, format } from 'date-fns';

const DashboardHome = () => {
  const navigate = useNavigate();
  const [xp, setXp] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [progressStats, setProgressStats] = useState({ afpCompleted: 0, afpTotal: 10, videosWatched: 0 });

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userRef = doc(firestore, 'users', auth.currentUser.uid);
        try {
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            setXp(snap.data().xp || 0);
          }
        } catch (err) {
          console.error("Could not fetch XP", err);
        }
      }
    };
    fetchUserData();

    if (auth.currentUser) {
      // Fetch Recent Activity (AFP Submissions)
      const subRef = ref(database, 'dna_submissions');
      const unsubSub = onValue(subRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const subs = Object.keys(data)
            .map(key => ({ id: key, ...data[key] }))
            .filter(s => s.userId === auth.currentUser.uid)
            .sort((a, b) => b.timestamp - a.timestamp);
          
          setRecentActivity(subs.slice(0, 3));
          
          const passed = subs.filter(s => s.score >= 60).length;
          setProgressStats(prev => ({ ...prev, afpCompleted: passed }));
        }
      });

      // Fetch Video Progress
      const vidRef = ref(database, `video_progress/${auth.currentUser.uid}`);
      const unsubVid = onValue(vidRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const watched = Object.values(data).filter(v => v.percentage >= 90).length;
          setProgressStats(prev => ({ ...prev, videosWatched: watched }));
        }
      });

      // Fetch Calendar Events
      const calRef = ref(database, 'calendar_events');
      const unsubCal = onValue(calRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const events = Object.keys(data)
            .map(key => ({ id: key, ...data[key] }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          
          // Filter future events
          const future = events.filter(e => new Date(e.date).getTime() >= new Date().setHours(0,0,0,0));
          setCalendarEvents(future.slice(0, 3));
        } else {
          setCalendarEvents([]);
        }
      });

      return () => { unsubSub(); unsubVid(); unsubCal(); };
    }
  }, []);

  const quickLinks = [
    { title: 'Live Session', subtitle: 'Join live classes', icon: <MonitorPlay size={20} color="#ef4444" />, bg: 'rgba(239,68,68,0.1)', path: '/dashboard/live' },
    { title: 'Practice Quiz', subtitle: 'Test your skills', icon: <HelpCircle size={20} color="#8b5cf6" />, bg: 'rgba(139,92,246,0.1)', path: '/dashboard/afp' },
    { title: 'Recordings', subtitle: 'Study resources', icon: <Video size={20} color="#10b981" />, bg: 'rgba(16,185,129,0.1)', path: '/dashboard/recordings' },
    { title: 'Leaderboard', subtitle: 'See top performers', icon: <Trophy size={20} color="#eab308" />, bg: 'rgba(234,179,8,0.1)', path: '/dashboard/leaderboard' },
    { title: 'Certificate', subtitle: 'View achievements', icon: <Award size={20} color="#3b82f6" />, bg: 'rgba(59,130,246,0.1)', path: '/dashboard/certificate' },
  ];

  const totalTasks = 20;
  const completedTasks = progressStats.afpCompleted + progressStats.videosWatched;
  const progressPercent = Math.min(100, Math.round((completedTasks / totalTasks) * 100));
  
  // Render dummy calendar grid for current month
  const today = new Date();
  const currentMonth = format(today, 'MMMM yyyy');
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '30px', display: 'flex', flexDirection: 'column', gap: '30px', color: '#e2e8f0' }}>
      
      {/* 1. HERO BANNER */}
      <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', borderRadius: '20px', padding: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)' }}>
        <div style={{ position: 'absolute', right: '-10%', top: '-50%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }}></div>
        <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#e0e7ff', fontWeight: 500 }}>Welcome back,</p>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem', fontWeight: 800 }}>
            {auth.currentUser ? (auth.currentUser.email.split('@')[0]) : 'Student'} <span style={{ fontSize: '2rem' }}>👋</span>
          </h1>
          <p style={{ margin: '0 0 25px 0', color: '#e0e7ff', fontSize: '1rem' }}>Keep learning, keep growing! You're doing great.</p>
          <button onClick={() => navigate('/dashboard/afp')} style={{ background: 'white', color: '#4f46e5', border: 'none', padding: '12px 24px', borderRadius: '30px', fontWeight: 700, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            Continue Learning →
          </button>
        </div>
        
        {/* Book Graphic */}
        <div style={{ position: 'relative', zIndex: 1, margin: '0 20px', mixBlendMode: 'screen' }}>
          <img src="/hero-books.jpg" alt="Study Books" style={{ height: '140px', objectFit: 'contain', borderRadius: '12px' }} />
        </div>

        {/* Total XP Floating Box */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', zIndex: 1, background: 'white', padding: '25px 35px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)', color: '#1e293b', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
          <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total XP</span>
          <span style={{ fontSize: '3rem', fontWeight: 800, color: '#3b82f6', lineHeight: '1' }}>{xp}</span>
          <Trophy size={20} color="#f59e0b" style={{ marginTop: '5px' }} />
        </div>
      </div>

      {/* 2. QUICK ACCESS GRID */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#60a5fa', fontWeight: 600, fontSize: '1.1rem' }}>
        <MonitorPlay size={20} /> Quick Access
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {quickLinks.map(link => (
          <div key={link.title} onClick={() => navigate(link.path)} style={{ background: 'rgba(30,41,59,0.7)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}
               onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.background = 'rgba(30,41,59,1)'; }}
               onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = 'rgba(30,41,59,0.7)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ background: link.bg, padding: '12px', borderRadius: '12px' }}>{link.icon}</div>
              <div>
                <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '1rem', marginBottom: '2px' }}>{link.title}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{link.subtitle}</div>
              </div>
            </div>
            <ChevronRight size={18} color="#64748b" />
          </div>
        ))}
      </div>

      {/* 3. MAIN CONTENT SPLIT (Left: Progress/Activity, Right: Calendar) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Progress Card */}
          <div style={{ background: 'rgba(30,41,59,0.7)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc' }}>Your Progress</h3>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', background: 'rgba(0,0,0,0.2)', padding: '5px 10px', borderRadius: '10px' }}>This Month ⌄</span>
            </div>
            
            <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
              {/* Circular Progress Ring */}
              <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '50%', background: `conic-gradient(#3b82f6 ${progressPercent}%, rgba(255,255,255,0.05) ${progressPercent}%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', width: '90px', height: '90px', background: '#1e293b', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc' }}>{progressPercent}%</span>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Completed</span>
                </div>
              </div>

              {/* Progress Bars */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>Great job! You're on track.</p>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px', color: '#cbd5e1' }}>
                    <span>Videos Watched</span>
                    <span style={{ fontWeight: 700 }}>{progressStats.videosWatched} / 10</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(100, (progressStats.videosWatched / 10) * 100)}%`, height: '100%', background: '#a855f7' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px', color: '#cbd5e1' }}>
                    <span>Assignments Done</span>
                    <span style={{ fontWeight: 700 }}>{progressStats.afpCompleted} / {progressStats.afpTotal}</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(100, (progressStats.afpCompleted / progressStats.afpTotal) * 100)}%`, height: '100%', background: '#f59e0b' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div style={{ background: 'rgba(30,41,59,0.7)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc' }}>Recent Activity</h3>
              <span style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}>View All</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {recentActivity.length === 0 && <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No recent activity.</p>}
              {recentActivity.map((act, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', borderBottom: i < recentActivity.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: 'rgba(139,92,246,0.1)', padding: '10px', borderRadius: '10px' }}><FileText size={18} color="#8b5cf6" /></div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.95rem' }}>Submitted Assignment: {act.chapter}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '3px' }}>{formatDistanceToNow(new Date(act.timestamp), { addSuffix: true })}</div>
                    </div>
                  </div>
                  <div style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>+{act.xpAwarded} XP</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Calendar Widget */}
          <div style={{ background: 'rgba(30,41,59,0.7)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <ChevronLeft size={18} color="#94a3b8" cursor="pointer" />
              <span style={{ fontWeight: 700, color: '#f8fafc' }}>{currentMonth}</span>
              <ChevronRight size={18} color="#94a3b8" cursor="pointer" />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', gap: '5px' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, marginBottom: '10px' }}>{d}</div>
              ))}
              
              {/* Empty slots for first week */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              
              {/* Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const isToday = i + 1 === today.getDate();
                const hasEvent = calendarEvents.some(e => {
                  const d = new Date(e.date);
                  return d.getDate() === i+1 && d.getMonth() === today.getMonth();
                });

                return (
                  <div key={i} style={{ 
                    padding: '8px 0', 
                    fontSize: '0.85rem', 
                    color: isToday ? 'white' : '#cbd5e1', 
                    background: isToday ? '#3b82f6' : 'transparent',
                    borderRadius: '50%',
                    fontWeight: isToday || hasEvent ? 700 : 400,
                    cursor: 'pointer',
                    position: 'relative'
                  }}>
                    {i + 1}
                    {hasEvent && !isToday && <div style={{ position: 'absolute', bottom: '2px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', background: '#f59e0b', borderRadius: '50%' }}></div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Classes */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc' }}>Upcoming Classes</h3>
              <span style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}>View All</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {calendarEvents.length === 0 && <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No upcoming classes scheduled.</p>}
              
              {calendarEvents.map((evt, i) => {
                const d = new Date(evt.date);
                return (
                  <div key={evt.id} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '10px', minWidth: '55px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 700, textTransform: 'uppercase' }}>{format(d, 'MMM')}</span>
                      <span style={{ fontSize: '1.2rem', color: '#f8fafc', fontWeight: 800 }}>{format(d, 'dd')}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>{evt.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '3px' }}>{evt.time}</div>
                    </div>
                    <div style={{ fontSize: '0.75rem', background: evt.type === 'Live' ? 'rgba(59,130,246,0.2)' : 'rgba(16,185,129,0.2)', color: evt.type === 'Live' ? '#60a5fa' : '#34d399', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>
                      {evt.type}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quote Card */}
          <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', borderRadius: '16px', padding: '25px', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: '3rem', position: 'absolute', top: '10px', right: '20px', opacity: 0.2, fontFamily: 'serif' }}>"</div>
            <p style={{ margin: '0 0 15px 0', fontSize: '0.95rem', lineHeight: '1.5', fontStyle: 'italic', position: 'relative', zIndex: 1 }}>
              "The beautiful thing about learning is that no one can take it away from you."
            </p>
            <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>Keep pushing your limits! 🚀</p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DashboardHome;
