import React, { useState, useEffect, useRef } from 'react';
import { ref as dbRef, push } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database, storage } from '../firebaseConfig';
import { Camera, Monitor, AlertTriangle, ShieldCheck, CheckCircle, Clock } from 'lucide-react';
import quizLogo from '../assets/quix.png';

const QUESTIONS = [
  { id: 1, text: "Which is the largest state in India by area?", options: ["Maharashtra", "Rajasthan", "Madhya Pradesh", "Uttar Pradesh"], answer: "Rajasthan" },
  { id: 2, text: "Who wrote the Indian national anthem, 'Jana Gana Mana'?", options: ["Bankim Chandra Chattopadhyay", "Sarojini Naidu", "Rabindranath Tagore", "Subhas Chandra Bose"], answer: "Rabindranath Tagore" },
  { id: 3, text: "Which monument is known as the 'Symbol of Love'?", options: ["Red Fort", "India Gate", "Taj Mahal", "Qutub Minar"], answer: "Taj Mahal" },
  { id: 4, text: "What is the national flower of India?", options: ["Rose", "Lotus", "Jasmine", "Sunflower"], answer: "Lotus" },
  { id: 5, text: "Which Indian city is known as the 'Pink City'?", options: ["Jaipur", "Jodhpur", "Udaipur", "Bhopal"], answer: "Jaipur" },
  { id: 6, text: "On which date is India's Independence Day celebrated?", options: ["26 January", "15 August", "2 October", "14 November"], answer: "15 August" },
  { id: 7, text: "What is the national bird of India?", options: ["Eagle", "Parrot", "Peacock", "Swan"], answer: "Peacock" },
  { id: 8, text: "Who was the first Indian to win a Nobel Prize?", options: ["C. V. Raman", "Rabindranath Tagore", "Amartya Sen", "Mother Teresa"], answer: "Rabindranath Tagore" },
  { id: 9, text: "Which Article of the Indian Constitution deals with the Right to Equality?", options: ["Article 14", "Article 19", "Article 21", "Article 32"], answer: "Article 14" },
  { id: 10, text: "Which Indian space mission successfully landed near the Moon's south polar region in 2023?", options: ["Chandrayaan-1", "Mangalyaan", "Chandrayaan-2", "Chandrayaan-3"], answer: "Chandrayaan-3" }
];

const PublicQuiz = () => {
  const [stage, setStage] = useState('welcome'); // welcome | terms | setup | quiz | submitting | done
  const [participantName, setParticipantName] = useState('');
  
  // Permissions & Streams
  const [camStream, setCamStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [camError, setCamError] = useState('');
  const [screenError, setScreenError] = useState('');

  // Recording
  const camRecorderRef = useRef(null);
  const screenRecorderRef = useRef(null);
  const camChunksRef = useRef([]);
  const screenChunksRef = useRef([]);

  // Quiz State
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(480); // 8 minutes = 480 seconds
  const [graceTimeLeft, setGraceTimeLeft] = useState(60); // 1 minute warning if left tab
  const [isTabHidden, setIsTabHidden] = useState(false);
  const graceTimerRef = useRef(null);

  const videoRef = useRef(null); // To preview camera during setup

  useEffect(() => {
    if (stage === 'setup' && camStream && videoRef.current) {
      videoRef.current.srcObject = camStream;
    }
  }, [stage, camStream]);

  // Main Quiz Timer
  useEffect(() => {
    let timer;
    if (stage === 'quiz' && timeLeft > 0 && !isTabHidden) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (stage === 'quiz' && timeLeft === 0) {
      handleFinalSubmit();
    }
    return () => clearInterval(timer);
  }, [stage, timeLeft, isTabHidden]);

  // Anti-Cheat: Visibility API
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (stage === 'quiz') {
        if (document.visibilityState === 'hidden') {
          setIsTabHidden(true);
          setGraceTimeLeft(60); // reset grace timer
        } else {
          setIsTabHidden(false);
          clearInterval(graceTimerRef.current);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [stage]);

  // Grace Timer (if tab is hidden)
  useEffect(() => {
    if (isTabHidden && stage === 'quiz') {
      graceTimerRef.current = setInterval(() => {
        setGraceTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(graceTimerRef.current);
            handleFinalSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(graceTimerRef.current);
  }, [isTabHidden, stage]);

  const requestPermissions = async () => {
    setCamError('');
    setScreenError('');
    try {
      const cStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setCamStream(cStream);
      
      const sStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      setScreenStream(sStream);
      
      // Listen to screen sharing stop (user clicked Stop Sharing natively)
      sStream.getVideoTracks()[0].onended = () => {
        if(stage === 'quiz') handleFinalSubmit(); 
      };
    } catch (err) {
      console.error(err);
      if (!camStream) setCamError('Camera/Microphone permission denied.');
      if (!screenStream) setScreenError('Screen share permission denied.');
    }
  };

  const startQuiz = () => {
    if (!camStream || !screenStream) return;
    
    // Initialize recorders
    camRecorderRef.current = new MediaRecorder(camStream, { mimeType: 'video/webm' });
    screenRecorderRef.current = new MediaRecorder(screenStream, { mimeType: 'video/webm' });

    camRecorderRef.current.ondataavailable = e => { if (e.data.size > 0) camChunksRef.current.push(e.data); };
    screenRecorderRef.current.ondataavailable = e => { if (e.data.size > 0) screenChunksRef.current.push(e.data); };

    camRecorderRef.current.start();
    screenRecorderRef.current.start();

    setStage('quiz');
  };

  const stopStreamsAndRecordings = async () => {
    return new Promise((resolve) => {
      let camDone = false, screenDone = false;
      const checkDone = () => { if (camDone && screenDone) resolve(); };

      if (camRecorderRef.current && camRecorderRef.current.state !== 'inactive') {
        camRecorderRef.current.onstop = () => { camDone = true; checkDone(); };
        camRecorderRef.current.stop();
      } else { camDone = true; }

      if (screenRecorderRef.current && screenRecorderRef.current.state !== 'inactive') {
        screenRecorderRef.current.onstop = () => { screenDone = true; checkDone(); };
        screenRecorderRef.current.stop();
      } else { screenDone = true; }

      // Stop tracks to turn off camera light
      if (camStream) camStream.getTracks().forEach(t => t.stop());
      if (screenStream) screenStream.getTracks().forEach(t => t.stop());
      
      checkDone(); // In case they were already inactive
    });
  };

  const handleFinalSubmit = async () => {
    setStage('submitting');
    clearInterval(graceTimerRef.current);
    
    await stopStreamsAndRecordings();

    const timestamp = Date.now();
    const safeName = participantName.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    // Create blobs
    const camBlob = new Blob(camChunksRef.current, { type: 'video/webm' });
    const screenBlob = new Blob(screenChunksRef.current, { type: 'video/webm' });

    let camUrl = '';
    let screenUrl = '';

    try {
      const camStorageRef = storageRef(storage, `quiz_recordings/${safeName}_${timestamp}_camera.webm`);
      const screenStorageRef = storageRef(storage, `quiz_recordings/${safeName}_${timestamp}_screen.webm`);

      await uploadBytes(camStorageRef, camBlob);
      camUrl = await getDownloadURL(camStorageRef);

      await uploadBytes(screenStorageRef, screenBlob);
      screenUrl = await getDownloadURL(screenStorageRef);

      // Calculate score
      let score = 0;
      QUESTIONS.forEach(q => {
        if (answers[q.id] === q.answer) score += 1;
      });

      // Save to database
      await push(dbRef(database, 'quiz_submissions'), {
        name: participantName,
        score: score,
        total: QUESTIONS.length,
        answers: answers,
        camVideoUrl: camUrl,
        screenVideoUrl: screenUrl,
        timestamp: timestamp
      });

      setStage('done');
    } catch (error) {
      console.error("Error submitting:", error);
      alert("There was an error submitting your quiz. Please contact support.");
      setStage('done'); // End anyway to prevent infinite loading
    }
  };

  // UI Renderers
  if (stage === 'welcome') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
          <img src={quizLogo} alt="Know Our India" style={{ width: '100%', borderRadius: '12px', marginBottom: '20px' }} />
          <h1 style={{ color: '#1e293b', fontSize: '1.8rem', marginBottom: '10px' }}>KNOW OUR INDIA</h1>
          <p style={{ color: '#64748b', marginBottom: '30px' }}>National Quiz Competition</p>
          
          <input 
            type="text" 
            placeholder="Please enter your full name" 
            value={participantName} 
            onChange={e => setParticipantName(e.target.value)}
            style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1.1rem', marginBottom: '20px', outline: 'none' }}
          />
          <button 
            onClick={() => setStage('terms')} 
            disabled={!participantName.trim()}
            style={{ width: '100%', padding: '15px', background: participantName.trim() ? '#3b82f6' : '#cbd5e1', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: participantName.trim() ? 'pointer' : 'not-allowed' }}
          >
            Continue to Terms
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'terms') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', maxWidth: '700px', width: '100%' }}>
          <h2 style={{ color: '#1e293b', fontSize: '1.8rem', marginBottom: '20px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <ShieldCheck size={28} color="#10b981" /> Terms & Conditions
          </h2>
          
          <div style={{ background: '#f1f5f9', padding: '20px', borderRadius: '12px', maxHeight: '400px', overflowY: 'auto', fontSize: '0.95rem', color: '#475569', lineHeight: '1.6' }}>
            <p><strong>1. Quiz Duration:</strong> Each participant will get only 8 minutes to complete the quiz.</p>
            <p><strong>2. One Attempt Only:</strong> Each participant is allowed one attempt only. Once submitted, the answers cannot be changed.</p>
            <p><strong>3. Online Participation:</strong> The quiz will be conducted completely online.</p>
            <p><strong>4. Start Time:</strong> The quiz will begin at the announced time. Sunday, September 6 after 11:00 AM.</p>
            <p><strong>5. Time Limit:</strong> The quiz will automatically end when the 8-minute limit is reached.</p>
            <p><strong>6. Fair Play:</strong> Participants must answer independently. Any form of cheating, impersonation, or unfair assistance may result in disqualification. <strong>Camera and screen recording will be strictly monitored.</strong></p>
            <p><strong>7. Results:</strong> Winners will be selected according to the score and applicable tie-breaking rules.</p>
            <p><strong>8. Certificates:</strong> Eligible participants will receive a participation certificate.</p>
            <p><strong>9. Technical Issues:</strong> Organizers are not responsible for problems caused by the participant’s device, internet connection, or power failure.</p>
            <p><strong>10. Safety & Proctoring:</strong> By proceeding, you agree to grant Camera and Screen Recording permissions. Leaving the tab during the exam will result in auto-submission.</p>
          </div>

          <button onClick={() => setStage('setup')} style={{ width: '100%', padding: '15px', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}>
            I Agree, Proceed to Setup
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'setup') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', maxWidth: '600px', width: '100%', textAlign: 'center' }}>
          <h2 style={{ color: '#1e293b', fontSize: '1.8rem', marginBottom: '10px' }}>Safety & Proctoring Setup</h2>
          <p style={{ color: '#64748b', marginBottom: '30px' }}>We require camera and screen permissions to ensure a fair competition.</p>

          {(camError || screenError) && (
            <div style={{ background: '#fef2f2', border: '1px solid #f87171', color: '#b91c1c', padding: '15px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
              <AlertTriangle size={24} />
              <div>
                <strong>Warning:</strong> Please allow your camera and screen sharing to safety. <br/>
                {camError} {screenError}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
            <div style={{ flex: 1, background: camStream ? '#ecfdf5' : '#f1f5f9', padding: '20px', borderRadius: '16px', border: `2px solid ${camStream ? '#10b981' : '#e2e8f0'}` }}>
              <Camera size={32} color={camStream ? "#10b981" : "#64748b"} style={{ marginBottom: '10px' }} />
              <div style={{ fontWeight: 'bold', color: camStream ? '#065f46' : '#475569' }}>{camStream ? 'Camera Active' : 'Camera Required'}</div>
            </div>
            <div style={{ flex: 1, background: screenStream ? '#ecfdf5' : '#f1f5f9', padding: '20px', borderRadius: '16px', border: `2px solid ${screenStream ? '#10b981' : '#e2e8f0'}` }}>
              <Monitor size={32} color={screenStream ? "#10b981" : "#64748b"} style={{ marginBottom: '10px' }} />
              <div style={{ fontWeight: 'bold', color: screenStream ? '#065f46' : '#475569' }}>{screenStream ? 'Screen Active' : 'Screen Required'}</div>
            </div>
          </div>

          {camStream && (
            <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '20px', background: '#000' }} />
          )}

          {(!camStream || !screenStream) ? (
            <button onClick={requestPermissions} style={{ width: '100%', padding: '15px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
              Grant Permissions
            </button>
          ) : (
            <button onClick={startQuiz} style={{ width: '100%', padding: '15px', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
              Start Quiz Now
            </button>
          )}
        </div>
      </div>
    );
  }

  if (stage === 'quiz') {
    const formatTime = (secs) => {
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return `${m}:${s < 10 ? '0'+s : s}`;
    };

    if (isTabHidden) {
      return (
        <div style={{ minHeight: '100vh', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '24px', textAlign: 'center', maxWidth: '500px' }}>
            <AlertTriangle size={60} color="#ef4444" style={{ marginBottom: '20px' }} />
            <h2 style={{ fontSize: '2rem', color: '#b91c1c', marginBottom: '10px' }}>WARNING!</h2>
            <p style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '20px' }}>You have left the quiz tab. This violates the safety rules.</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b' }}>Auto-submitting in: <span style={{ color: '#ef4444' }}>{graceTimeLeft} seconds</span></p>
            <p style={{ marginTop: '20px', color: '#64748b' }}>Return to the quiz immediately to prevent submission.</p>
          </div>
        </div>
      );
    }

    return (
      <div style={{ minHeight: '100vh', background: '#f4f7fe', padding: '20px 0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          {/* Header */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1.2rem' }}>Know Our India</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: timeLeft < 60 ? '#fef2f2' : '#f1f5f9', color: timeLeft < 60 ? '#ef4444' : '#3b82f6', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', fontSize: '1.1rem' }}>
              <Clock size={20} /> {formatTime(timeLeft)}
            </div>
          </div>

          {/* Questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
            {QUESTIONS.map((q, i) => (
              <div key={q.id} style={{ background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '1.15rem', color: '#1e293b', lineHeight: '1.5' }}>
                  {i + 1}. {q.text}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {q.options.map(opt => (
                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '12px', border: answers[q.id] === opt ? '2px solid #3b82f6' : '2px solid #e2e8f0', background: answers[q.id] === opt ? '#eff6ff' : 'white', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <input 
                        type="radio" 
                        name={`question-${q.id}`} 
                        value={opt} 
                        checked={answers[q.id] === opt} 
                        onChange={() => setAnswers({...answers, [q.id]: opt})}
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '1rem', color: '#334155', fontWeight: answers[q.id] === opt ? 'bold' : 'normal' }}>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleFinalSubmit} style={{ width: '100%', padding: '20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '16px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 20px rgba(59,130,246,0.3)' }}>
            Submit Final Answers
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'submitting') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: 'white', padding: '50px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
          <div style={{ width: '60px', height: '60px', border: '5px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px auto' }}></div>
          <h2 style={{ color: '#1e293b', marginBottom: '10px' }}>Submitting Quiz & Secure Data...</h2>
          <p style={{ color: '#64748b' }}>Please do not close or refresh this page. This may take a few moments depending on your connection.</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (stage === 'done') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: 'white', padding: '50px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', maxWidth: '500px' }}>
          <CheckCircle size={80} color="#10b981" style={{ margin: '0 auto 20px auto' }} />
          <h2 style={{ color: '#1e293b', fontSize: '2rem', marginBottom: '15px' }}>Thank you!</h2>
          <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: '1.6' }}>Your participation is completed successfully and your secure recordings have been saved.</p>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '20px' }}>You may now close this window safely.</p>
        </div>
      </div>
    );
  }

  return null;
};

export default PublicQuiz;
