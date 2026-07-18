import React, { useState, useEffect } from 'react';
import { ShieldAlert, Trash2, Send, Image as ImageIcon, MessageSquare, AlertTriangle } from 'lucide-react';
import { ref, onValue, set, remove, push } from 'firebase/database';
import { database, auth } from '../firebaseConfig';

const AdminPanel = () => {
  const [passcode, setPasscode] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');

  // Admin states
  const [alertMsg, setAlertMsg] = useState('');
  const [comments, setComments] = useState([]);
  const [storyImage, setStoryImage] = useState('');
  const [storyText, setStoryText] = useState('');

  const handleUnlock = (e) => {
    e.preventDefault();
    if (passcode === 'nur1438nur') {
      setUnlocked(true);
      setError('');
    } else {
      setError('Invalid Admin Passcode');
    }
  };

  useEffect(() => {
    if (!unlocked) return;
    const chatRef = ref(database, 'live_chat');
    const unsub = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const msgs = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setComments(msgs.sort((a, b) => b.timestamp - a.timestamp)); // Newest first
      } else {
        setComments([]);
      }
    });
    return () => unsub();
  }, [unlocked]);

  const sendGlobalAlert = async (e) => {
    e.preventDefault();
    if (!alertMsg) return;
    try {
      await set(ref(database, 'admin_alert'), {
        message: alertMsg,
        timestamp: Date.now()
      });
      alert('Global Alert Sent!');
      setAlertMsg('');
    } catch (err) {
      alert('Error sending alert');
    }
  };

  const clearGlobalAlert = async () => {
    await remove(ref(database, 'admin_alert'));
    alert('Alert Cleared!');
  };

  const deleteComment = async (id) => {
    if(window.confirm('Delete this comment completely?')) {
      await remove(ref(database, `live_chat/${id}`));
    }
  };

  const postToStoryCorner = async (e) => {
    e.preventDefault();
    if (!storyText && !storyImage) return;
    try {
      await push(ref(database, 'story_corner'), {
        text: storyText,
        imageUrl: storyImage,
        author: 'Admin',
        timestamp: Date.now()
      });
      alert('Posted to Story Corner!');
      setStoryText('');
      setStoryImage('');
    } catch (err) {
      alert('Failed to post');
    }
  };

  if (!unlocked) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '20px' }}>
        <form onSubmit={handleUnlock} style={{ background: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
          <ShieldAlert size={50} color="#ef4444" style={{ marginBottom: '20px' }} />
          <h2 style={{ color: 'white', marginBottom: '20px' }}>Admin Access Restricted</h2>
          <input 
            type="password" 
            placeholder="Enter Admin Passcode" 
            value={passcode} 
            onChange={e=>setPasscode(e.target.value)} 
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', marginBottom: '15px', background: 'rgba(0,0,0,0.2)', color: 'white' }}
          />
          <button type="submit" style={{ width: '100%', background: '#ef4444', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Unlock</button>
          {error && <p style={{ color: '#f87171', marginTop: '15px', fontSize: '0.9rem' }}>{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', color: 'white' }}>
      <h1 style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', color: '#f8fafc' }}>
        <ShieldAlert color="#ef4444" /> System Administration Control Panel
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
        
        {/* Global Notifications */}
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0, color: '#f59e0b' }}><AlertTriangle /> Global Dashboard Alert</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Send a pop-up alert to every user's dashboard instantly.</p>
          <form onSubmit={sendGlobalAlert} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <textarea value={alertMsg} onChange={e=>setAlertMsg(e.target.value)} placeholder="Type alert message..." style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', minHeight: '80px' }}></textarea>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ flex: 1, background: '#f59e0b', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Send Alert</button>
              <button type="button" onClick={clearGlobalAlert} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>Clear</button>
            </div>
          </form>
        </div>

        {/* Story Corner Publisher */}
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0, color: '#3b82f6' }}><ImageIcon /> Publish to Story Corner</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Post announcements or images directly to the Story Corner feed.</p>
          <form onSubmit={postToStoryCorner} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" value={storyImage} onChange={e=>setStoryImage(e.target.value)} placeholder="Image URL (Optional)" style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }} />
            <textarea value={storyText} onChange={e=>setStoryText(e.target.value)} placeholder="Post Description..." style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', minHeight: '80px' }}></textarea>
            <button type="submit" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Publish Post</button>
          </form>
        </div>

      </div>

      {/* Comment Moderation */}
      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', marginTop: '30px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0, color: '#ec4899' }}><MessageSquare /> Comment Moderation</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>Monitor and delete any user comments across the platform.</p>
        
        <div style={{ display: 'grid', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
          {comments.map(c => (
            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <span style={{ color: '#3b82f6', fontWeight: 600, fontSize: '0.85rem' }}>{c.sender}</span>
                <span style={{ color: '#64748b', fontSize: '0.8rem', marginLeft: '10px' }}>{new Date(c.timestamp).toLocaleString()}</span>
                <div style={{ marginTop: '5px', color: '#e2e8f0' }}>{c.text}</div>
              </div>
              <button onClick={() => deleteComment(c.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {comments.length === 0 && <div style={{ color: '#64748b' }}>No comments found in database.</div>}
        </div>
      </div>

    </div>
  );
};

export default AdminPanel;
