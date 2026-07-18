import React, { useState, useEffect, useRef } from 'react';
import { Video, Settings, Square, Circle, Play, Trash2, Edit2, Check, X } from 'lucide-react';
import { ref, push, onValue, set, remove, update } from 'firebase/database';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { auth, database, firestore } from '../firebaseConfig';

const LiveSession = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [editMsgText, setEditMsgText] = useState('');
  
  const [isInCall, setIsInCall] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const userRole = sessionStorage.getItem('userRole');
  const [activeTab, setActiveTab] = useState(userRole === 'teacher' ? 'teacher' : 'chat');
  const [isTeacherUnlocked, setIsTeacherUnlocked] = useState(userRole === 'teacher');
  const [passcode, setPasscode] = useState('');
  const [globalLiveStatus, setGlobalLiveStatus] = useState(false);
  
  const [quizQuestion, setQuizQuestion] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctOpt, setCorrectOpt] = useState('A');

  const [activeQuiz, setActiveQuiz] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const currentUserAlias = auth.currentUser ? auth.currentUser.email.split('@')[0] : 'Guest';

  const startJitsiCall = async () => {
    setIsInCall(true);
    
    // Set Global Live Status True
    if (userRole === 'teacher' || isTeacherUnlocked) {
      await set(ref(database, 'live_status'), {
        isLive: true,
        timestamp: Date.now()
      });
    }

    const roomName = 'EduVerseLiveSessionXYZ99';
    const jitsiUrl = `https://meet.jit.si/${roomName}#userInfo.displayName="${currentUserAlias}"`;
    window.open(jitsiUrl, '_blank');
  };

  const stopJitsiCall = async () => {
    setIsInCall(false);
    // End Global Live Status
    if (userRole === 'teacher' || isTeacherUnlocked) {
      await set(ref(database, 'live_status/isLive'), false);
    }
  };

  // Firebase Chat Init (with 24hr auto-delete logic)
  useEffect(() => {
    const chatRef = ref(database, 'live_chat');
    const unsubscribe = onValue(chatRef, (snapshot) => {
      setErrorMsg('');
      const data = snapshot.val();
      if (data) {
        const now = Date.now();
        const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
        
        let messages = [];
        Object.keys(data).forEach(key => {
          const msg = data[key];
          // Auto-delete logic: skip displaying if older than 24h
          if (now - msg.timestamp > TWENTY_FOUR_HOURS) {
            // Option to actively delete from DB here, but skipping display is safer
            remove(ref(database, `live_chat/${key}`));
          } else {
            messages.push({ id: key, ...msg });
          }
        });

        setChatMessages(messages.sort((a,b) => a.timestamp - b.timestamp));
      } else {
        setChatMessages([]);
      }
    }, (error) => {
      console.error("Firebase Read Error:", error);
    });
    return () => unsubscribe();
  }, []);

  // Firebase Live Quiz Listener
  useEffect(() => {
    const quizRef = ref(database, 'active_live_quiz');
    const unsubscribe = onValue(quizRef, (snapshot) => {
      const data = snapshot.val();
      setActiveQuiz(data);
      if (!data) setHasAnswered(false);
    });
    
    const liveRef = ref(database, 'live_status/isLive');
    const unsubLive = onValue(liveRef, (snapshot) => {
      setGlobalLiveStatus(!!snapshot.val());
    });
    
    return () => { unsubscribe(); unsubLive(); };
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const chatRef = ref(database, 'live_chat');
    try {
      await push(chatRef, { text: newMessage, sender: currentUserAlias, timestamp: Date.now() });
      setNewMessage('');
    } catch (err) {
      setErrorMsg("Cannot send message. Rules might be blocking.");
    }
  };

  const deleteMessage = async (id) => {
    if (window.confirm('Delete comment?')) {
      await remove(ref(database, `live_chat/${id}`));
    }
  };

  const saveEditedMessage = async (id) => {
    await update(ref(database, `live_chat/${id}`), {
      text: editMsgText,
      edited: true
    });
    setEditingMsgId(null);
  };

  const publishQuiz = async (e) => {
    e.preventDefault();
    if(!quizQuestion || !optA || !optB || !optC || !optD) return alert("Fill all fields");
    await set(ref(database, 'active_live_quiz'), {
      question: quizQuestion,
      options: { A: optA, B: optB, C: optC, D: optD },
      correct: correctOpt,
      publishedAt: Date.now()
    });
    alert("Quiz Published!");
  };

  const submitStudentAnswer = async (selectedOption) => {
    if (hasAnswered || !activeQuiz) return;
    setHasAnswered(true);
    if (selectedOption === activeQuiz.correct) {
      alert("Correct! You earned +10 XP!");
      const userRef = doc(firestore, 'users', auth.currentUser.uid);
      try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) await updateDoc(userRef, { xp: increment(10) });
        else await setDoc(userRef, { username: currentUserAlias, xp: 10, email: auth.currentUser.email });
      } catch (err) {}
    } else {
      alert(`Incorrect! The correct answer was ${activeQuiz.correct}.`);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      recordedChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunksRef.current.push(e.data); };
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        a.href = url;
        a.download = 'live_session_record.webm';
        a.click();
        window.URL.revokeObjectURL(url);
      };
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) { alert("Could not start screen recording."); }
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className="mobile-col" style={{ display: 'flex', height: '100%', background: '#0f172a', position: 'relative', color: 'white' }}>
      
      {/* Student Quiz Pop-up Modal */}
      {activeQuiz && userRole !== 'teacher' && (
        <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 50, background: 'rgba(30,41,59,0.95)', backdropFilter: 'blur(10px)', padding: '30px', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', width: '90%', maxWidth: '500px', border: '2px solid #3b82f6' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#f8fafc', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ height: '15px', width: '15px', background: '#ef4444', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
            Live Pop Quiz!
          </h3>
          <p style={{ fontSize: '1.1rem', marginBottom: '20px', fontWeight: 600, color: 'white' }}>{activeQuiz.question}</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['A', 'B', 'C', 'D'].map(opt => (
              <button 
                key={opt}
                onClick={() => submitStudentAnswer(opt)}
                disabled={hasAnswered}
                style={{ padding: '12px', background: hasAnswered ? (opt === activeQuiz.correct ? '#22c55e' : 'rgba(255,255,255,0.05)') : 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: hasAnswered ? 'default' : 'pointer', textAlign: 'left', fontWeight: 500 }}
              >
                {opt}. {activeQuiz.options[opt]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Video Area */}
      <div className="mobile-padding" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', minHeight: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ margin: 0, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
            <Video size={24} color="#3b82f6" /> Live Session Room
          </h2>
          {isInCall && (
            <button onClick={isRecording ? stopRecording : startRecording} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: isRecording ? '#ef4444' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
              {isRecording ? <Square size={18} fill="currentColor" /> : <Circle size={18} fill="currentColor" />}
              <span className="hide-mobile">{isRecording ? 'Stop Recording' : 'Local Record'}</span>
            </button>
          )}
        </div>

        {/* Video Container or Join Screen */}
        {!isInCall ? (
          <div style={{ flex: 1, background: 'rgba(30,41,59,0.5)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {globalLiveStatus && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: '#ef4444', color: 'white', padding: '10px', fontWeight: 'bold', letterSpacing: '2px', animation: 'pulse 2s infinite' }}>
                🔴 LIVE CLASS IS CURRENTLY RUNNING
              </div>
            )}
            
            <div style={{ background: globalLiveStatus ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59,130,246,0.2)', padding: '20px', borderRadius: '50%', marginBottom: '20px', boxShadow: globalLiveStatus ? '0 0 30px rgba(239, 68, 68, 0.4)' : '0 0 30px rgba(59,130,246,0.3)', marginTop: globalLiveStatus ? '30px' : '0' }}>
              <Video size={50} color={globalLiveStatus ? '#ef4444' : '#60a5fa'} />
            </div>
            
            <h2 style={{ color: 'white', marginBottom: '10px', fontSize: '1.5rem' }}>
              {userRole === 'teacher' ? 'Start Your Live Class' : (globalLiveStatus ? 'Class is Live!' : 'Join the Live Class')}
            </h2>
            <p style={{ color: '#94a3b8', marginBottom: '30px' }}>
              {globalLiveStatus && userRole !== 'teacher' ? 'The teacher is live right now. Click below to fast join the session!' : 'The video session will securely open in a new tab.'}
            </p>
            
            <button onClick={startJitsiCall} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: globalLiveStatus && userRole !== 'teacher' ? '#ef4444' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', border: 'none', padding: '15px 40px', borderRadius: '30px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', transition: 'transform 0.2s', boxShadow: globalLiveStatus && userRole !== 'teacher' ? '0 10px 20px rgba(239,68,68,0.3)' : '0 10px 20px rgba(59,130,246,0.2)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <Play size={20} fill="currentColor" /> {userRole === 'teacher' ? 'Start Session & Notify Students' : (globalLiveStatus ? 'FAST JOIN LIVE' : 'Join Session')}
            </button>
          </div>
        ) : (
          <div style={{ flex: 1, background: '#000', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px', textAlign: 'center' }}>
             <Video size={60} color="#4b5563" style={{ marginBottom: '20px' }} />
             <h3 style={{ color: 'white', margin: '0 0 10px 0' }}>Session is running!</h3>
             <p style={{ color: '#9ca3af', margin: '0 0 20px 0' }}>You can continue using the dashboard chat here.</p>
             <button onClick={stopJitsiCall} style={{ background: '#ef4444', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>End Session Status</button>
          </div>
        )}
      </div>

      {/* Sidebar Area */}
      <div className="side-panel" style={{ width: '350px', background: 'rgba(30,41,59,0.8)', borderLeft: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
        
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={() => setActiveTab('chat')} style={{ flex: 1, padding: '15px', background: activeTab === 'chat' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', borderBottom: activeTab === 'chat' ? '2px solid #3b82f6' : 'none', fontWeight: 600, color: activeTab === 'chat' ? '#60a5fa' : '#94a3b8', cursor: 'pointer' }}>
            Live Chat
          </button>
          <button onClick={() => setActiveTab('teacher')} style={{ flex: 1, padding: '15px', background: activeTab === 'teacher' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', borderBottom: activeTab === 'teacher' ? '2px solid #3b82f6' : 'none', fontWeight: 600, color: activeTab === 'teacher' ? '#60a5fa' : '#94a3b8', cursor: 'pointer' }}>
            Teacher Room
          </button>
        </div>

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ fontSize: '0.75rem', textAlign: 'center', color: '#64748b', marginBottom: '10px' }}>Messages auto-delete after 24 hours</div>
              
              {chatMessages.map(msg => (
                <div key={msg.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: 600 }}>{msg.sender} {msg.edited && <span style={{color: '#64748b', fontSize: '0.7rem'}}>(edited)</span>}</div>
                    
                    {/* Comment Controls (Edit/Delete) */}
                    {msg.sender === currentUserAlias && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Edit2 size={12} color="#94a3b8" style={{ cursor: 'pointer' }} onClick={() => { setEditingMsgId(msg.id); setEditMsgText(msg.text); }} />
                        <Trash2 size={12} color="#ef4444" style={{ cursor: 'pointer' }} onClick={() => deleteMessage(msg.id)} />
                      </div>
                    )}
                  </div>
                  
                  {editingMsgId === msg.id ? (
                    <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                      <input type="text" value={editMsgText} onChange={e=>setEditMsgText(e.target.value)} style={{ flex: 1, padding: '5px', borderRadius: '4px', border: '1px solid #3b82f6', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '0.9rem' }} />
                      <button onClick={() => saveEditedMessage(msg.id)} style={{ background: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', padding: '0 8px', cursor: 'pointer' }}><Check size={14}/></button>
                      <button onClick={() => setEditingMsgId(null)} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '0 8px', cursor: 'pointer' }}><X size={14}/></button>
                    </div>
                  ) : (
                    <div style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>{msg.text}</div>
                  )}
                </div>
              ))}
              {chatMessages.length === 0 && <div style={{ color: '#64748b', textAlign: 'center', marginTop: '20px' }}>No recent messages...</div>}
            </div>
            
            <form onSubmit={sendMessage} style={{ padding: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '10px', background: 'rgba(15,23,42,0.95)' }}>
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." style={{ flex: 1, padding: '12px 15px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', borderRadius: '20px', fontSize: '0.95rem' }} />
              <button type="submit" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0 20px', borderRadius: '20px', fontWeight: 600, cursor: 'pointer' }}>Send</button>
            </form>
          </>
        )}

        {/* Teacher Tab */}
        {activeTab === 'teacher' && (
          <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
            {!isTeacherUnlocked ? (
              <form onSubmit={(e) => { e.preventDefault(); if(passcode==='nur1438nur') setIsTeacherUnlocked(true); else alert('Wrong pass'); }} style={{ textAlign: 'center', marginTop: '50px' }}>
                <Settings size={40} color="#94a3b8" style={{ marginBottom: '20px' }} />
                <h3 style={{ color: '#e2e8f0', marginBottom: '20px' }}>Teacher Access</h3>
                <input type="password" placeholder="Passcode" value={passcode} onChange={e=>setPasscode(e.target.value)} style={{ padding: '12px', width: '100%', marginBottom: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
                <button type="submit" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', width: '100%', fontWeight: 600, cursor: 'pointer' }}>Unlock</button>
              </form>
            ) : (
              <div>
                <h3 style={{ color: 'white', marginBottom: '20px' }}>Push Live Quiz</h3>
                <form onSubmit={publishQuiz} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <textarea placeholder="Question..." value={quizQuestion} onChange={e=>setQuizQuestion(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', minHeight: '80px', fontFamily: 'inherit' }} required />
                  <input type="text" placeholder="Option A" value={optA} onChange={e=>setOptA(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }} required />
                  <input type="text" placeholder="Option B" value={optB} onChange={e=>setOptB(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }} required />
                  <input type="text" placeholder="Option C" value={optC} onChange={e=>setOptC(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }} required />
                  <input type="text" placeholder="Option D" value={optD} onChange={e=>setOptD(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }} required />
                  
                  <div style={{ marginTop: '10px' }}>
                    <label style={{ fontSize: '0.9rem', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Correct Answer:</label>
                    <select value={correctOpt} onChange={e=>setCorrectOpt(e.target.value)} style={{ padding: '10px', width: '100%', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}>
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button type="submit" style={{ flex: 1, background: '#22c55e', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Publish</button>
                    <button type="button" onClick={async () => await remove(ref(database, 'active_live_quiz'))} style={{ flex: 1, background: '#ef4444', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Clear</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default LiveSession;
