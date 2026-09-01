import React, { useState, useEffect, useRef } from 'react';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import { Camera, Monitor, AlertTriangle, ShieldCheck, CheckCircle, Clock, Landmark, ChevronRight } from 'lucide-react';
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

const API_URL = import.meta.env.VITE_BACKEND_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : 'https://t-a-d.onrender.com/api');

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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(480); // 8 minutes = 480 seconds
  
  const [graceTimeLeft, setGraceTimeLeft] = useState(60);
  const [isViolation, setIsViolation] = useState(false);
  const graceTimerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (stage === 'setup' && camStream && videoRef.current) {
      videoRef.current.srcObject = camStream;
    }
  }, [stage, camStream]);

  // Main Quiz Timer
  useEffect(() => {
    let timer;
    if (stage === 'quiz' && timeLeft > 0 && !isViolation) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (stage === 'quiz' && timeLeft === 0) {
      handleFinalSubmit();
    }
    return () => clearInterval(timer);
  }, [stage, timeLeft, isViolation]);

  // Anti-Cheat: Visibility API & Fullscreen
  useEffect(() => {
    const handleViolationTrigger = () => {
      if (stage === 'quiz') {
        setIsViolation(true);
        setGraceTimeLeft(60);
      }
    };

    const handleViolationResolve = () => {
      if (stage === 'quiz') {
        const isFullscreen = !!document.fullscreenElement;
        const isVisible = document.visibilityState === 'visible';
        if (isFullscreen && isVisible) {
          setIsViolation(false);
          clearInterval(graceTimerRef.current);
        }
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') handleViolationTrigger();
      else handleViolationResolve();
    };

    const onFullscreenChange = () => {
      if (!document.fullscreenElement) handleViolationTrigger();
      else handleViolationResolve();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, [stage]);

  // Grace Timer (if violation active)
  useEffect(() => {
    if (isViolation && stage === 'quiz') {
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
  }, [isViolation, stage]);

  const requestPermissions = async () => {
    setCamError('');
    setScreenError('');
    try {
      const cStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setCamStream(cStream);
      
      const sStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      setScreenStream(sStream);
      
      sStream.getVideoTracks()[0].onended = () => {
        if(stage === 'quiz') handleFinalSubmit(); 
      };
    } catch (err) {
      console.error(err);
      if (!camStream) setCamError('Camera/Microphone permission denied.');
      if (!screenStream) setScreenError('Screen share permission denied.');
    }
  };

  const startQuiz = async () => {
    if (!camStream || !screenStream) return;
    
    try {
      await document.documentElement.requestFullscreen();
    } catch (err) {
      console.warn("Fullscreen request failed", err);
    }

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

      if (camStream) camStream.getTracks().forEach(t => t.stop());
      if (screenStream) screenStream.getTracks().forEach(t => t.stop());
      
      checkDone();
    });
  };

  const handleFinalSubmit = async () => {
    setStage('submitting');
    clearInterval(graceTimerRef.current);
    
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(e => console.warn(e));
    }

    await stopStreamsAndRecordings();

    const timestamp = Date.now();
    const safeName = participantName.replace(/[^a-z0-9]/gi, '_').toLowerCase();

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

      let score = 0;
      QUESTIONS.forEach(q => {
        if (answers[q.id] === q.answer) score += 1;
      });

      // Save to MongoDB
      await fetch(`${API_URL}/quiz-submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: participantName,
          score: score,
          total: QUESTIONS.length,
          answers: answers,
          camVideoUrl: camUrl,
          screenVideoUrl: screenUrl
        })
      });

      setStage('done');
    } catch (error) {
      console.error("Error submitting:", error);
      alert("There was an error submitting your quiz. Please contact support.");
      setStage('done');
    }
  };

  const TopHeader = () => (
    <div style={{ background: '#1e293b', color: 'white', padding: '15px 30px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', borderBottom: '4px solid #f59e0b' }}>
      <Landmark size={28} color="#f59e0b" />
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Government of India</h2>
        <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Satyameva Jayate</span>
      </div>
    </div>
  );

  // UI Renderers
  if (stage === 'welcome') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        <TopHeader />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
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
      </div>
    );
  }

  if (stage === 'terms') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        <TopHeader />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
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
              <p><strong>10. Safety & Proctoring:</strong> By proceeding, you agree to grant Camera and Screen Recording permissions. Leaving the tab or exiting fullscreen during the exam will result in auto-submission.</p>
            </div>
            <button onClick={() => setStage('setup')} style={{ width: '100%', padding: '15px', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}>
              I Agree, Proceed to Setup
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'setup') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        <TopHeader />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
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
      </div>
    );
  }

  if (stage === 'quiz') {
    const formatTime = (secs) => {
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return `${m}:${s < 10 ? '0'+s : s}`;
    };

    if (isViolation) {
      return (
        <div style={{ minHeight: '100vh', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '24px', textAlign: 'center', maxWidth: '500px' }}>
            <AlertTriangle size={60} color="#ef4444" style={{ marginBottom: '20px' }} />
            <h2 style={{ fontSize: '2rem', color: '#b91c1c', marginBottom: '10px' }}>WARNING!</h2>
            <p style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '20px' }}>You have exited fullscreen or left the quiz tab. This violates the safety rules.</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b' }}>Auto-submitting in: <span style={{ color: '#ef4444' }}>{graceTimeLeft} seconds</span></p>
            <button onClick={startQuiz} style={{ marginTop: '20px', padding: '12px 24px', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
              Return to Fullscreen Now
            </button>
          </div>
        </div>
      );
    }

    const currentQuestion = QUESTIONS[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1;

    return (
      <div style={{ minHeight: '100vh', background: '#f4f7fe', display: 'flex', flexDirection: 'column' }}>
        <TopHeader />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '800px', width: '100%', margin: '0 auto', padding: '30px 20px' }}>
          
          <div style={{ background: 'white', padding: '20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <div style={{ fontWeight: 'bold', color: '#64748b', fontSize: '1rem' }}>
              Question {currentQuestionIndex + 1} of {QUESTIONS.length}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: timeLeft < 60 ? '#fef2f2' : '#f1f5f9', color: timeLeft < 60 ? '#ef4444' : '#3b82f6', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', fontSize: '1.1rem' }}>
              <Clock size={20} /> {formatTime(timeLeft)}
            </div>
          </div>

          <div style={{ background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 30px 0', fontSize: '1.4rem', color: '#1e293b', lineHeight: '1.5' }}>
              {currentQuestion.text}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
              {currentQuestion.options.map(opt => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '20px', borderRadius: '16px', border: answers[currentQuestion.id] === opt ? '2px solid #3b82f6' : '2px solid #e2e8f0', background: answers[currentQuestion.id] === opt ? '#eff6ff' : 'white', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <input 
                    type="radio" 
                    name={`question-${currentQuestion.id}`} 
                    value={opt} 
                    checked={answers[currentQuestion.id] === opt} 
                    onChange={() => setAnswers({...answers, [currentQuestion.id]: opt})}
                    style={{ width: '22px', height: '22px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '1.1rem', color: '#334155', fontWeight: answers[currentQuestion.id] === opt ? 'bold' : 'normal' }}>{opt}</span>
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
              {isLastQuestion ? (
                <button onClick={handleFinalSubmit} style={{ padding: '15px 40px', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  Submit Competition <CheckCircle size={20} />
                </button>
              ) : (
                <button onClick={() => setCurrentQuestionIndex(i => i + 1)} style={{ padding: '15px 40px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  Next Question <ChevronRight size={20} />
                </button>
              )}
            </div>
          </div>
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
