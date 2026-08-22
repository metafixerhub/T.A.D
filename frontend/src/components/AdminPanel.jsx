import React, { useState, useEffect } from 'react';
import { ShieldAlert, Trash2, Send, Image as ImageIcon, MessageSquare, AlertTriangle, Award, MonitorPlay, PlayCircle } from 'lucide-react';
import { ref, onValue, set, remove, push } from 'firebase/database';
import { doc, getDoc, updateDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { database, auth, firestore } from '../firebaseConfig';

const AfpSubmissionItem = ({ sub, approveAfp, declineAfp }) => {
  const [customXp, setCustomXp] = useState(sub.xp || 50);
  return (
    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ color: '#3b82f6', fontWeight: 600, fontSize: '0.9rem' }}>{sub.userEmail}</span>
        <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.9rem' }}>{sub.chapter}</span>
      </div>
      <div style={{ color: '#e2e8f0', fontSize: '0.85rem', whiteSpace: 'pre-wrap', maxHeight: '150px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px', marginBottom: '10px' }}>
        {sub.answerText}
      </div>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input type="number" value={customXp} onChange={e=>setCustomXp(e.target.value)} style={{ width: '80px', padding: '8px', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }} />
        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>XP</span>
        <button onClick={() => approveAfp(sub, Number(customXp))} style={{ flex: 1, background: '#10b981', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Approve</button>
        <button onClick={() => declineAfp(sub)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Decline</button>
      </div>
    </div>
  );
};

const AdminPanel = () => {
  const [passcode, setPasscode] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');

  // Admin states
  const [notifText, setNotifText] = useState('');
  const [notifFile, setNotifFile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [comments, setComments] = useState([]);
  const [storyFiles, setStoryFiles] = useState([]);
  const [storyText, setStoryText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [isLiveActive, setIsLiveActive] = useState(false);

  // AFP (DNA) States
  const [dnaChapter, setDnaChapter] = useState('');
  const [dnaXP, setDnaXP] = useState('');
  const [dnaQuestions, setDnaQuestions] = useState('');
  const [dnaSubmissions, setDnaSubmissions] = useState([]);
  const [afpAssessments, setAfpAssessments] = useState([]);

  // Story states for manager
  const [stories, setStories] = useState([]);

  // Student Video Progress
  const [studentProgress, setStudentProgress] = useState({});
  const [users, setUsers] = useState([]);

  // Recordings States
  const [recordingTitle, setRecordingTitle] = useState('');
  const [recordingUrl, setRecordingUrl] = useState('');
  const [recordingThumb, setRecordingThumb] = useState(null);
  const [recordings, setRecordings] = useState([]);

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

    const liveRef = ref(database, 'live_status/isLive');
    const unsubLive = onValue(liveRef, (snapshot) => {
      setIsLiveActive(!!snapshot.val());
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

    const recRef = ref(database, 'recordings');
    const unsubRec = onValue(recRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const recs = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setRecordings(recs.sort((a, b) => b.timestamp - a.timestamp));
      } else {
        setRecordings([]);
      }
    });

    const storyRef = ref(database, 'story_corner');
    const unsubStory = onValue(storyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setStories(list.sort((a, b) => b.timestamp - a.timestamp));
      } else {
        setStories([]);
      }
    });

    const afpRef = ref(database, 'dna_assessments');
    const unsubAfp = onValue(afpRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setAfpAssessments(list.sort((a, b) => b.timestamp - a.timestamp));
      } else {
        setAfpAssessments([]);
      }
    });

    const progRef = ref(database, 'video_progress');
    const unsubProg = onValue(progRef, (snapshot) => {
      setStudentProgress(snapshot.val() || {});
    });

    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(firestore, 'users'));
        const usersList = [];
        snapshot.forEach(doc => usersList.push({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
      } catch (e) {
        console.error("Failed to fetch users", e);
      }
    };
    fetchUsers();

    return () => { unsub(); unsubSub(); unsubLive(); unsubNotif(); unsubRec(); unsubStory(); unsubAfp(); unsubProg(); };
  }, [unlocked]);

  const publishNotification = async (e) => {
    e.preventDefault();
    if (!notifText && !notifFile) return;
    
    setIsUploading(true);
    let imageUrl = null;
    
    try {
      if (notifFile) {
        setUploadProgress('Uploading image...');
        const formData = new FormData();
        formData.append('file', notifFile);
        
        const response = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) throw new Error('Upload failed');
        const data = await response.json();
        imageUrl = `${API_URL}/materials/download/${data.file.filename}`;
      }
      
      setUploadProgress('Publishing Notification...');
      
      await push(ref(database, 'notifications'), {
        text: notifText,
        imageUrl: imageUrl,
        timestamp: Date.now()
      });
      
      alert('Notification Published!');
      setNotifText('');
      setNotifFile(null);
    } catch (err) {
      console.error(err);
      alert(`Failed to publish: ${err.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  const deleteNotification = async (id) => {
    if(window.confirm('Delete this notification?')) {
      await remove(ref(database, `notifications/${id}`));
    }
  };

  const publishRecording = async (e) => {
    e.preventDefault();
    if (!recordingTitle || !recordingUrl) return;
    
    setIsUploading(true);
    let thumbUrl = null;
    
    try {
      if (recordingThumb) {
        setUploadProgress('Uploading custom thumbnail...');
        const formData = new FormData();
        formData.append('file', recordingThumb);
        
        const response = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) throw new Error('Upload failed');
        const data = await response.json();
        thumbUrl = `${API_URL}/materials/download/${data.file.filename}`;
      }
      
      setUploadProgress('Publishing Recording...');
      
      await push(ref(database, 'recordings'), {
        title: recordingTitle,
        url: recordingUrl,
        thumbUrl: thumbUrl,
        timestamp: Date.now()
      });
      
      alert('Recording Published!');
      setRecordingTitle('');
      setRecordingUrl('');
      setRecordingThumb(null);
      // Reset the file input visually
      e.target.reset(); 
    } catch (err) {
      console.error(err);
      alert(`Failed to publish: ${err.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  const deleteRecording = async (id) => {
    if(window.confirm('Delete this recording?')) {
      await remove(ref(database, `recordings/${id}`));
    }
  };

  const deleteComment = async (id) => {
    if(window.confirm('Delete this comment completely?')) {
      await remove(ref(database, `live_chat/${id}`));
    }
  };

  const deleteStory = async (id) => {
    if(window.confirm('Delete this Story Corner post?')) {
      await remove(ref(database, `story_corner/${id}`));
    }
  };

  const deleteAfp = async (id) => {
    if(window.confirm('Delete this AFP Assignment?')) {
      await remove(ref(database, `dna_assessments/${id}`));
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

  const toggleLiveStatus = async () => {
    try {
      await set(ref(database, 'live_status'), {
        isLive: !isLiveActive,
        timestamp: Date.now()
      });
      alert(isLiveActive ? 'Live Status Turned OFF' : 'Live Status Turned ON globally!');
    } catch(err) {
      alert('Failed to change live status');
    }
  };

  const publishAFP = async (e) => {
    e.preventDefault();
    if(!dnaChapter || !dnaQuestions) return;
    try {
      await push(ref(database, 'dna_assessments'), {
        chapter: dnaChapter,
        xp: Number(dnaXP) || 50,
        questions: dnaQuestions,
        timestamp: Date.now()
      });
      alert('AFP Assignment Published!');
      setDnaChapter(''); setDnaXP(''); setDnaQuestions('');
    } catch(err) {
      alert('Failed to publish AFP');
    }
  };

  const approveAfp = async (sub, customXpAmount) => {
    try {
      await set(ref(database, `dna_submissions/${sub.id}/approved`), true);
      const userRef = doc(firestore, 'users', sub.userId);
      const userSnap = await getDoc(userRef);
      if(userSnap.exists()) {
        await updateDoc(userRef, { xp: (userSnap.data().xp || 0) + customXpAmount });
      } else {
        await setDoc(userRef, { xp: customXpAmount, username: sub.userEmail, email: sub.userEmail });
      }
      alert(`Approved! Awarded ${customXpAmount} XP to ${sub.userEmail}`);
    } catch(err) {
      console.error(err);
      alert(`Failed to approve AFP submission: ${err.message}`);
    }
  };

  const declineAfp = async (sub) => {
    if(window.confirm('Are you sure you want to decline and delete this submission?')) {
      try {
        await remove(ref(database, `dna_submissions/${sub.id}`));
      } catch(err) {
        alert('Failed to decline');
      }
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
        
        {/* Live Session Broadcast Control */}
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0, color: '#ef4444' }}><MonitorPlay /> Live Session Control</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>Broadcast a global banner to all students telling them to join the Live Class.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: isLiveActive ? '#22c55e' : '#94a3b8' }}>
              Current Status: {isLiveActive ? '🔴 Broadcasting Live' : '⚫ Offline'}
            </div>
            
            <button onClick={toggleLiveStatus} style={{ width: '100%', background: isLiveActive ? '#ef4444' : '#22c55e', color: 'white', border: 'none', padding: '15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '1.1rem' }}>
              {isLiveActive ? 'Turn Off Global Live Banner' : 'Turn On Global Live Banner'}
            </button>
          </div>
        </div>

        {/* Notification Publisher */}
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0, color: '#f59e0b' }}><AlertTriangle /> Notification Center</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Send a notification to everyone's dashboard bell icon.</p>
          <form onSubmit={publishNotification} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="file" accept="image/*" onChange={e=>setNotifFile(e.target.files[0])} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }} />
            <textarea value={notifText} onChange={e=>setNotifText(e.target.value)} placeholder="Type notification message..." required style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', minHeight: '80px' }}></textarea>
            <button type="submit" disabled={isUploading} style={{ background: isUploading ? '#94a3b8' : '#f59e0b', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: isUploading ? 'not-allowed' : 'pointer', fontWeight: 600 }}>
              {isUploading ? uploadProgress : 'Publish Notification'}
            </button>
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

        {/* Class Recordings Publisher */}
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0, color: '#ec4899' }}><PlayCircle /> Publish Class Recording</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Publish a YouTube recording link for students to watch inline.</p>
          <form onSubmit={publishRecording} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" value={recordingTitle} onChange={e=>setRecordingTitle(e.target.value)} placeholder="Video Title" required style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }} />
            <input type="url" value={recordingUrl} onChange={e=>setRecordingUrl(e.target.value)} placeholder="YouTube URL" required style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }} />
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '5px' }}>Custom Thumbnail (Optional, defaults to YouTube):</div>
            <input type="file" accept="image/*" onChange={e=>setRecordingThumb(e.target.files[0])} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }} />
            <button type="submit" disabled={isUploading} style={{ background: isUploading ? '#94a3b8' : '#ec4899', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: isUploading ? 'not-allowed' : 'pointer', fontWeight: 600 }}>
              {isUploading ? uploadProgress : 'Publish Recording'}
            </button>
          </form>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginTop: '30px' }}>
        {/* Notification Manager */}
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0, color: '#f59e0b' }}><AlertTriangle /> Manage Notifications</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '15px' }}>Delete old or incorrect notifications.</p>
          <div style={{ display: 'grid', gap: '10px', maxHeight: '450px', overflowY: 'auto' }}>
            {notifications.map(notif => (
              <div key={notif.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{new Date(notif.timestamp).toLocaleString()}</span>
                  <button onClick={() => deleteNotification(notif.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                </div>
                {notif.imageUrl && <img src={notif.imageUrl} alt="Notification" style={{ width: '100%', borderRadius: '6px', marginBottom: '10px', maxHeight: '150px', objectFit: 'cover' }} />}
                <div style={{ color: '#e2e8f0', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                  {notif.text}
                </div>
              </div>
            ))}
            {notifications.length === 0 && <div style={{ color: '#64748b' }}>No notifications found.</div>}
          </div>
        </div>
        {/* AFP Publisher */}
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0, color: '#10b981' }}><Award size={20} /> Publish AFP Assessment</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Publish new AFP assignments for students to complete.</p>
          <form onSubmit={publishAFP} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="text" value={dnaChapter} onChange={e=>setDnaChapter(e.target.value)} placeholder="Chapter Title (e.g. Chapter 2)" required style={{ flex: 2, padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }} />
              <input type="number" value={dnaXP} onChange={e=>setDnaXP(e.target.value)} placeholder="XP" required style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>
            <textarea value={dnaQuestions} onChange={e=>setDnaQuestions(e.target.value)} placeholder="Paste Questions Format Here..." required style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', minHeight: '120px' }}></textarea>
            <button type="submit" style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Publish AFP</button>
          </form>
        </div>

        {/* AFP Submissions */}
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0, color: '#8b5cf6' }}><Award size={20} /> AFP Submissions</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '15px' }}>Review student answers and award XP.</p>
          <div style={{ display: 'grid', gap: '10px', maxHeight: '450px', overflowY: 'auto' }}>
            {dnaSubmissions.map(sub => (
              <AfpSubmissionItem key={sub.id} sub={sub} approveAfp={approveAfp} declineAfp={declineAfp} />
            ))}
            {dnaSubmissions.length === 0 && <div style={{ color: '#64748b' }}>No pending submissions.</div>}
          </div>
        </div>

        {/* Recordings Manager */}
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0, color: '#ec4899' }}><PlayCircle /> Manage Recordings</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '15px' }}>Delete old recordings.</p>
          <div style={{ display: 'grid', gap: '10px', maxHeight: '450px', overflowY: 'auto' }}>
            {recordings.map(rec => (
              <div key={rec.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{new Date(rec.timestamp).toLocaleString()}</span>
                  <button onClick={() => deleteRecording(rec.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                </div>
                {rec.thumbUrl && <img src={rec.thumbUrl} alt="Thumbnail" style={{ width: '100%', borderRadius: '6px', marginBottom: '10px', maxHeight: '100px', objectFit: 'cover' }} />}
                <div style={{ color: '#e2e8f0', fontSize: '0.95rem', fontWeight: 'bold' }}>{rec.title}</div>
                <a href={rec.url} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', fontSize: '0.8rem', wordBreak: 'break-all' }}>{rec.url}</a>
              </div>
            ))}
            {recordings.length === 0 && <div style={{ color: '#64748b' }}>No recordings found.</div>}
          </div>
        </div>

        {/* Story Corner Manager */}
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0, color: '#3b82f6' }}><ImageIcon /> Manage Story Corner</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '15px' }}>Delete old Story Corner posts.</p>
          <div style={{ display: 'grid', gap: '10px', maxHeight: '450px', overflowY: 'auto' }}>
            {stories.map(story => (
              <div key={story.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{new Date(story.timestamp).toLocaleString()}</span>
                  <button onClick={() => deleteStory(story.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                </div>
                <div style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>{story.text}</div>
                {story.attachments && story.attachments.length > 0 && <span style={{ color: '#3b82f6', fontSize: '0.8rem' }}>{story.attachments.length} attachment(s)</span>}
              </div>
            ))}
            {stories.length === 0 && <div style={{ color: '#64748b' }}>No stories found.</div>}
          </div>
        </div>

        {/* AFP Manager */}
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0, color: '#10b981' }}><Award /> Manage AFP Assignments</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '15px' }}>Delete old assignments.</p>
          <div style={{ display: 'grid', gap: '10px', maxHeight: '450px', overflowY: 'auto' }}>
            {afpAssessments.map(afp => (
              <div key={afp.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{new Date(afp.timestamp).toLocaleString()}</span>
                  <button onClick={() => deleteAfp(afp.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                </div>
                <div style={{ color: '#e2e8f0', fontSize: '0.95rem', fontWeight: 'bold' }}>{afp.chapter || afp.title}</div>
                <span style={{ color: '#10b981', fontSize: '0.8rem' }}>{afp.xp} XP</span>
              </div>
            ))}
            {afpAssessments.length === 0 && <div style={{ color: '#64748b' }}>No assignments found.</div>}
          </div>
        </div>
      </div>

      {/* Student Video Progress */}
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '15px', margin: '40px 0 20px 0', color: '#f8fafc', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <PlayCircle color="#f59e0b" /> Student Video Progress
      </h2>
      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: '#94a3b8' }}>
              <th style={{ padding: '12px' }}>Student</th>
              <th style={{ padding: '12px' }}>Video Name</th>
              <th style={{ padding: '12px' }}>Progress</th>
              <th style={{ padding: '12px' }}>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? users.map(u => {
              const userVids = studentProgress[u.id];
              if (!userVids) return null;
              return Object.entries(userVids).map(([vidId, prog]) => (
                <tr key={`${u.id}-${vidId}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px' }}>{u.email}</td>
                  <td style={{ padding: '12px', color: '#3b82f6' }}>{prog.videoTitle || 'Unknown Video'}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ background: prog.percent === 100 ? '#10b981' : '#f59e0b', width: `${prog.percent}%`, height: '100%' }}></div>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: prog.percent === 100 ? '#10b981' : 'white' }}>{prog.percent}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', fontSize: '0.85rem', color: '#94a3b8' }}>{new Date(prog.lastUpdated).toLocaleString()}</td>
                </tr>
              ));
            }) : (
              <tr><td colSpan="4" style={{ padding: '12px', color: '#64748b', textAlign: 'center' }}>No progress data found.</td></tr>
            )}
          </tbody>
        </table>
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
