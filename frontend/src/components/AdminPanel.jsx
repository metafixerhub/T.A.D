import React, { useState, useEffect } from 'react';
import { ShieldAlert, Trash2, Send, Image as ImageIcon, MessageSquare, AlertTriangle } from 'lucide-react';
import { ref, onValue, set, remove, push } from 'firebase/database';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { database, auth, firestore } from '../firebaseConfig';

const AdminPanel = () => {
  const [passcode, setPasscode] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');

  // Admin states
  const [alertMsg, setAlertMsg] = useState('');
  const [comments, setComments] = useState([]);
  const [storyFiles, setStoryFiles] = useState([]);
  const [storyText, setStoryText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  // DNA States
  const [dnaChapter, setDnaChapter] = useState('');
  const [dnaXP, setDnaXP] = useState('');
  const [dnaQuestions, setDnaQuestions] = useState('');
  const [dnaAnswers, setDnaAnswers] = useState('');
  const [dnaSubmissions, setDnaSubmissions] = useState([]);

  const API_URL = import.meta.env.VITE_BACKEND_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : 'https://t-a-d.onrender.com/api');

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
        setComments(msgs.sort((a, b) => b.timestamp - a.timestamp));
      } else {
        setComments([]);
      }
    });

    const subRef = ref(database, 'dna_submissions');
    const unsubSub = onValue(subRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const subs = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setDnaSubmissions(subs.filter(s => !s.approved).sort((a, b) => a.timestamp - b.timestamp));
      } else {
        setDnaSubmissions([]);
      }
    });

    return () => { unsub(); unsubSub(); };
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
    if (!storyText && storyFiles.length === 0) return;
    
    setIsUploading(true);
    let attachments = [];
    
    try {
      if (storyFiles.length > 0) {
        for (let i = 0; i < storyFiles.length; i++) {
          setUploadProgress(`Uploading file ${i + 1} of ${storyFiles.length}...`);
          const file = storyFiles[i];
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
          });
          
          if (!response.ok) throw new Error('Upload failed');
          const data = await response.json();
          
          attachments.push({
            name: file.name,
            type: file.type.includes('pdf') ? 'pdf' : 'image',
            url: `${API_URL}/materials/download/${data.file.filename}`
          });
        }
      }
      
      setUploadProgress('Publishing to Story Corner...');
      
      await push(ref(database, 'story_corner'), {
        text: storyText,
        attachments: attachments,
        author: 'Admin',
        timestamp: Date.now()
      });
      
      alert('Posted to Story Corner!');
      setStoryText('');
      setStoryFiles([]);
    } catch (err) {
      console.error(err);
      alert(`Failed to post: ${err.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  const publishDNA = async (e) => {
    e.preventDefault();
    if(!dnaChapter || !dnaQuestions) return;
    try {
      await push(ref(database, 'dna_assessments'), {
        chapter: dnaChapter,
        xp: Number(dnaXP) || 50,
        questions: dnaQuestions,
        answers: dnaAnswers,
        timestamp: Date.now()
      });
      alert('DNA Published!');
      setDnaChapter(''); setDnaXP(''); setDnaQuestions(''); setDnaAnswers('');
    } catch(err) {
      alert('Failed to publish DNA');
    }
  };

  const approveDNA = async (sub) => {
    try {
      await set(ref(database, `dna_submissions/${sub.id}/approved`), true);
      const userRef = doc(firestore, 'users', sub.userId);
      const userSnap = await getDoc(userRef);
      if(userSnap.exists()) {
        await updateDoc(userRef, { xp: (userSnap.data().xp || 0) + (sub.xp || 50) });
      }
      alert(`Approved! Awarded XP to ${sub.userEmail}`);
    } catch(err) {
      console.error(err);
      alert('Failed to approve DNA submission');
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
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Post announcements, images, or PDFs directly to the feed.</p>
          <form onSubmit={postToStoryCorner} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="file" multiple accept="image/*,.pdf" onChange={e=>setStoryFiles(Array.from(e.target.files))} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }} />
            <textarea value={storyText} onChange={e=>setStoryText(e.target.value)} placeholder="Post Description (Unlimited length)..." style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', minHeight: '80px' }}></textarea>
            <button type="submit" disabled={isUploading} style={{ background: isUploading ? '#94a3b8' : '#3b82f6', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: isUploading ? 'not-allowed' : 'pointer', fontWeight: 600 }}>
              {isUploading ? uploadProgress : 'Publish Post'}
            </button>
          </form>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginTop: '30px' }}>
        {/* DNA Publisher */}
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0, color: '#10b981' }}><Award size={20} /> Publish DNA Assessment</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Publish new DNA chapters for students to complete.</p>
          <form onSubmit={publishDNA} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="text" value={dnaChapter} onChange={e=>setDnaChapter(e.target.value)} placeholder="Chapter Title (e.g. Chapter 2)" required style={{ flex: 2, padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }} />
              <input type="number" value={dnaXP} onChange={e=>setDnaXP(e.target.value)} placeholder="XP" required style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>
            <textarea value={dnaQuestions} onChange={e=>setDnaQuestions(e.target.value)} placeholder="Paste Questions Format Here..." required style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', minHeight: '120px' }}></textarea>
            <textarea value={dnaAnswers} onChange={e=>setDnaAnswers(e.target.value)} placeholder="Paste Answer Key Format Here..." required style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', minHeight: '120px' }}></textarea>
            <button type="submit" style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Publish DNA</button>
          </form>
        </div>

        {/* DNA Submissions */}
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0, color: '#8b5cf6' }}><Award size={20} /> DNA Submissions</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '15px' }}>Review student answers and award XP.</p>
          <div style={{ display: 'grid', gap: '10px', maxHeight: '450px', overflowY: 'auto' }}>
            {dnaSubmissions.map(sub => (
              <div key={sub.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#3b82f6', fontWeight: 600, fontSize: '0.9rem' }}>{sub.userEmail}</span>
                  <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.9rem' }}>{sub.chapter}</span>
                </div>
                <div style={{ color: '#e2e8f0', fontSize: '0.85rem', whiteSpace: 'pre-wrap', maxHeight: '150px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px', marginBottom: '10px' }}>
                  {sub.answerText}
                </div>
                <button onClick={() => approveDNA(sub)} style={{ width: '100%', background: '#8b5cf6', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                  Approve & Award {sub.xp} XP
                </button>
              </div>
            ))}
            {dnaSubmissions.length === 0 && <div style={{ color: '#64748b' }}>No pending submissions.</div>}
          </div>
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
