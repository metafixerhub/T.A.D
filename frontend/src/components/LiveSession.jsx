import React, { useState, useEffect, useRef } from 'react';
import { Video, MessageSquare, Circle, Square, Settings, Send, X, Play } from 'lucide-react';
import { ref, push, onValue, set, remove } from 'firebase/database';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { auth, database, firestore } from '../firebaseConfig';

const LiveSession = () => {
  const jitsiContainerRef = useRef(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Call State
  const [isInCall, setIsInCall] = useState(false);
  const jitsiApiRef = useRef(null);

  // Custom Recording State
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  // Role & Teacher UI State
  const userRole = sessionStorage.getItem('userRole');
  const [activeTab, setActiveTab] = useState(userRole === 'teacher' ? 'teacher' : 'chat');
  const [isTeacherUnlocked, setIsTeacherUnlocked] = useState(userRole === 'teacher');
  const [passcode, setPasscode] = useState('');
  
  // Quiz Builder State
  const [quizQuestion, setQuizQuestion] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctOpt, setCorrectOpt] = useState('A');

  // Live Quiz State for Students
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const startJitsiCall = () => {
    setIsInCall(true);
    const roomName = 'MetaFixerHubLMSLiveSession123';
    // Append user info to the URL if possible (Jitsi supports hash params for this)
    const displayName = auth.currentUser?.email?.split('@')[0] || 'Student';
    const email = auth.currentUser?.email || '';
    const jitsiUrl = `https://meet.jit.si/${roomName}#userInfo.displayName="${displayName}"&userInfo.email="${email}"`;
    
    window.open(jitsiUrl, '_blank');
  };

  // Firebase Chat Init
  useEffect(() => {
    const chatRef = ref(database, 'live_chat');
    const unsubscribe = onValue(chatRef, (snapshot) => {
      setErrorMsg('');
      const data = snapshot.val();
      if (data) {
        const messages = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setChatMessages(messages.sort((a,b) => a.timestamp - b.timestamp));
      } else {
        setChatMessages([]);
      }
    }, (error) => {
      console.error("Firebase Read Error:", error);
      setErrorMsg("Connection Error. Check Firebase Database Rules.");
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
    return () => unsubscribe();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const user = auth.currentUser;
    const chatRef = ref(database, 'live_chat');
    try {
      await push(chatRef, { text: newMessage, sender: user ? user.email.split('@')[0] : 'Guest', timestamp: Date.now() });
      setNewMessage('');
    } catch (err) {
      console.error("Firebase Write Error:", err);
      setErrorMsg("Cannot send message. Rules might be blocking.");
    }
  };

  const publishQuiz = async (e) => {
    e.preventDefault();
    if(!quizQuestion || !optA || !optB || !optC || !optD) return alert("Fill all fields");
    const quizRef = ref(database, 'active_live_quiz');
    await set(quizRef, {
      question: quizQuestion,
      options: { A: optA, B: optB, C: optC, D: optD },
      correct: correctOpt,
      publishedAt: Date.now()
    });
    alert("Quiz Published to all students!");
  };

  const clearQuiz = async () => {
    await remove(ref(database, 'active_live_quiz'));
  };

  const submitStudentAnswer = async (selectedOption) => {
    if (hasAnswered || !activeQuiz) return;
    setHasAnswered(true);
    
    if (selectedOption === activeQuiz.correct) {
      alert("Correct! You earned +10 XP!");
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(firestore, 'users', user.uid);
        try {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            await updateDoc(userRef, { xp: increment(10) });
          } else {
            await setDoc(userRef, { username: user.email.split('@')[0], xp: 10, email: user.email });
          }
        } catch (err) {
          console.error("XP Error:", err);
        }
      }
    } else {
      alert(`Incorrect! The correct answer was ${activeQuiz.correct}.`);
    }
  };

  // Custom Local Screen Recording (Alternative to Jitsi built-in)
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
    <div className="mobile-col" style={{ display: 'flex', height: '100%', background: '#f9fafb', position: 'relative' }}>
      
      {/* Student Quiz Pop-up Modal */}
      {activeQuiz && userRole !== 'teacher' && (
        <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 50, background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', width: '90%', maxWidth: '500px', border: '2px solid #3b82f6' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#1f2937', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ height: '15px', width: '15px', background: '#ef4444', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
            Live Pop Quiz!
          </h3>
          <p style={{ fontSize: '1.1rem', marginBottom: '20px', fontWeight: 600 }}>{activeQuiz.question}</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['A', 'B', 'C', 'D'].map(opt => (
              <button 
                key={opt}
                onClick={() => submitStudentAnswer(opt)}
                disabled={hasAnswered}
                style={{ padding: '12px', background: hasAnswered ? (opt === activeQuiz.correct ? '#22c55e' : '#f3f4f6') : '#f8fafc', color: hasAnswered && opt === activeQuiz.correct ? 'white' : '#1f2937', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: hasAnswered ? 'default' : 'pointer', textAlign: 'left', fontWeight: 500 }}
              >
                {opt}. {activeQuiz.options[opt]}
              </button>
            ))}
          </div>
          {hasAnswered && <p style={{ textAlign: 'center', marginTop: '15px', color: '#6b7280', fontSize: '0.9rem' }}>Waiting for teacher to clear quiz...</p>}
        </div>
      )}

      {/* Main Video Area */}
      <div className="mobile-padding" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', minHeight: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ margin: 0, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
            <Video size={24} color="#2563eb" /> Live Session
          </h2>
          {isInCall && (
            <button onClick={isRecording ? stopRecording : startRecording} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: isRecording ? '#ef4444' : '#1f2937', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
              {isRecording ? <Square size={18} fill="currentColor" /> : <Circle size={18} fill="currentColor" />}
              <span className="hide-mobile">{isRecording ? 'Stop Recording' : 'Local Record'}</span>
            </button>
          )}
        </div>

        {/* Video Container or Join Screen */}
        {!isInCall ? (
          <div style={{ flex: 1, background: 'white', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', padding: '20px', textAlign: 'center' }}>
            <div style={{ background: '#eff6ff', padding: '20px', borderRadius: '50%', marginBottom: '20px' }}>
              <Video size={50} color="#3b82f6" />
            </div>
            <h2 style={{ color: '#1f2937', marginBottom: '10px', fontSize: '1.5rem' }}>{userRole === 'teacher' ? 'Start Your Live Class' : 'Join the Live Class'}</h2>
            <p style={{ color: '#64748b', marginBottom: '30px' }}>The video session will open in a new tab to prevent timeouts.</p>
            <button onClick={startJitsiCall} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#2563eb', color: 'white', border: 'none', padding: '15px 40px', borderRadius: '30px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#1d4ed8'} onMouseOut={e => e.currentTarget.style.background = '#2563eb'}>
              <Play size={20} fill="currentColor" /> {userRole === 'teacher' ? 'Start Session (New Tab)' : 'Join Session (New Tab)'}
            </button>
          </div>
        ) : (
          <div style={{ flex: 1, background: '#111', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px', textAlign: 'center' }}>
             <Video size={60} color="#4b5563" style={{ marginBottom: '20px' }} />
             <h3 style={{ color: 'white', margin: '0 0 10px 0' }}>Session is open in a new tab!</h3>
             <p style={{ color: '#9ca3af', margin: '0 0 20px 0' }}>You can continue using the dashboard chat and quizzes here.</p>
             <button onClick={() => setIsInCall(false)} style={{ background: 'transparent', border: '1px solid #4b5563', color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Return to Join Screen</button>
          </div>
        )}
      </div>

      {/* Sidebar Area */}
      <div className="side-panel" style={{ width: '350px', background: '#ffffff', borderLeft: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
        
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
          <button onClick={() => setActiveTab('chat')} style={{ flex: 1, padding: '15px', background: activeTab === 'chat' ? 'white' : '#f8fafc', border: 'none', borderBottom: activeTab === 'chat' ? '2px solid #2563eb' : 'none', fontWeight: 600, color: activeTab === 'chat' ? '#2563eb' : '#64748b', cursor: 'pointer' }}>
            Live Chat
          </button>
          <button onClick={() => setActiveTab('teacher')} style={{ flex: 1, padding: '15px', background: activeTab === 'teacher' ? 'white' : '#f8fafc', border: 'none', borderBottom: activeTab === 'teacher' ? '2px solid #2563eb' : 'none', fontWeight: 600, color: activeTab === 'teacher' ? '#2563eb' : '#64748b', cursor: 'pointer' }}>
            Teacher Controls
          </button>
        </div>

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <>
            {errorMsg && <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px', fontSize: '0.85rem', textAlign: 'center', borderBottom: '1px solid #fee2e2', fontWeight: 500 }}>{errorMsg}</div>}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {chatMessages.map(msg => (
                <div key={msg.id} style={{ background: '#f3f4f6', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '4px', fontWeight: 600 }}>{msg.sender}</div>
                  <div style={{ color: '#1f2937', fontSize: '0.95rem' }}>{msg.text}</div>
                </div>
              ))}
              {chatMessages.length === 0 && <div style={{ color: '#9ca3af', textAlign: 'center', marginTop: '20px' }}>No messages yet...</div>}
            </div>
            <form onSubmit={sendMessage} style={{ padding: '20px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '10px' }}>
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." style={{ flex: 1, padding: '10px 15px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '0.95rem' }} />
              <button type="submit" style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: 600, cursor: 'pointer' }}>Send</button>
            </form>
          </>
        )}

        {/* Teacher Tab */}
        {activeTab === 'teacher' && (
          <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
            {!isTeacherUnlocked ? (
              <form onSubmit={(e) => { e.preventDefault(); if(passcode==='nur1438nur') setIsTeacherUnlocked(true); else alert('Wrong pass'); }} style={{ textAlign: 'center', marginTop: '50px' }}>
                <Settings size={40} color="#94a3b8" style={{ marginBottom: '20px' }} />
                <h3 style={{ color: '#334155', marginBottom: '20px' }}>Teacher Access</h3>
                <input type="password" placeholder="Passcode" value={passcode} onChange={e=>setPasscode(e.target.value)} style={{ padding: '10px', width: '100%', marginBottom: '15px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                <button type="submit" style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', width: '100%', fontWeight: 600, cursor: 'pointer' }}>Unlock</button>
              </form>
            ) : (
              <div>
                <h3 style={{ color: '#1f2937', marginBottom: '20px' }}>Push Live Quiz</h3>
                <form onSubmit={publishQuiz} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <textarea placeholder="Question..." value={quizQuestion} onChange={e=>setQuizQuestion(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', minHeight: '80px', fontFamily: 'inherit' }} required />
                  <input type="text" placeholder="Option A" value={optA} onChange={e=>setOptA(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} required />
                  <input type="text" placeholder="Option B" value={optB} onChange={e=>setOptB(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} required />
                  <input type="text" placeholder="Option C" value={optC} onChange={e=>setOptC(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} required />
                  <input type="text" placeholder="Option D" value={optD} onChange={e=>setOptD(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} required />
                  
                  <div style={{ marginTop: '10px' }}>
                    <label style={{ fontSize: '0.9rem', color: '#64748b', display: 'block', marginBottom: '5px' }}>Correct Answer:</label>
                    <select value={correctOpt} onChange={e=>setCorrectOpt(e.target.value)} style={{ padding: '10px', width: '100%', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button type="submit" style={{ flex: 1, background: '#22c55e', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Publish</button>
                    <button type="button" onClick={clearQuiz} style={{ flex: 1, background: '#ef4444', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Clear</button>
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
