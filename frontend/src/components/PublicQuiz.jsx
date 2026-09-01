import React, { useState, useEffect, useRef } from 'react';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import { Camera, Monitor, AlertTriangle, ShieldCheck, CheckCircle } from 'lucide-react';

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
const EMBLEM_URL = "https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg";

const PublicQuiz = () => {
  const [stage, setStage] = useState('welcome');
  const [participantName, setParticipantName] = useState('');
  
  const [camStream, setCamStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [camError, setCamError] = useState('');
  const [screenError, setScreenError] = useState('');

  const camRecorderRef = useRef(null);
  const screenRecorderRef = useRef(null);
  const camChunksRef = useRef([]);
  const screenChunksRef = useRef([]);

  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(480);
  
  const [graceTimeLeft, setGraceTimeLeft] = useState(60);
  const [isViolation, setIsViolation] = useState(false);
  const graceTimerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (stage === 'setup' && camStream && videoRef.current) {
      videoRef.current.srcObject = camStream;
    }
  }, [stage, camStream]);

  useEffect(() => {
    let timer;
    if (stage === 'quiz' && timeLeft > 0 && !isViolation) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (stage === 'quiz' && timeLeft === 0) {
      handleFinalSubmit();
    }
    return () => clearInterval(timer);
  }, [stage, timeLeft, isViolation]);

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

  const OfficialHeader = () => (
    <div style={{ background: '#ffffff', width: '100%', borderTop: '6px solid #FF9933', borderBottom: '6px solid #138808', padding: '15px 40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      <img src={EMBLEM_URL} alt="Emblem of India" style={{ height: '70px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Georgia, serif' }}>
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#000080' }}>भारत सरकार</span>
        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000080' }}>GOVERNMENT OF INDIA</span>
      </div>
    </div>
  );

  const containerStyle = { minHeight: '100vh', background: '#f4f5f7', display: 'flex', flexDirection: 'column', fontFamily: 'Arial, sans-serif' };
  const cardStyle = { background: 'white', padding: '40px', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: '800px', width: '100%', borderTop: '4px solid #000080' };

  if (stage === 'welcome') {
    return (
      <div style={containerStyle}>
        <OfficialHeader />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ ...cardStyle, textAlign: 'center' }}>
            <h1 style={{ color: '#000080', fontSize: '1.8rem', marginBottom: '5px', fontFamily: 'Georgia, serif' }}>National Know Our India Quiz Competition</h1>
            <div style={{ width: '60px', height: '3px', background: '#FF9933', margin: '15px auto 30px auto' }}></div>
            <p style={{ color: '#333', marginBottom: '30px', fontSize: '1.1rem', lineHeight: '1.6' }}>
              Welcome to the official portal for the National Know Our India Quiz Competition. Please enter your full legal name below to register your participation.
            </p>
            
            <div style={{ textAlign: 'left', marginBottom: '20px', maxWidth: '400px', margin: '0 auto 30px auto' }}>
              <label style={{ display: 'block', fontWeight: 'bold', color: '#555', marginBottom: '8px' }}>Participant Name *</label>
              <input 
                type="text" 
                placeholder="Enter Full Name" 
                value={participantName} 
                onChange={e => setParticipantName(e.target.value)}
                style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', outline: 'none' }}
              />
            </div>
            <button 
              onClick={() => setStage('terms')} 
              disabled={!participantName.trim()}
              style={{ padding: '12px 40px', background: participantName.trim() ? '#000080' : '#ccc', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1.1rem', cursor: participantName.trim() ? 'pointer' : 'not-allowed', textTransform: 'uppercase', fontWeight: 'bold' }}
            >
              Proceed to Instructions
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'terms') {
    return (
      <div style={containerStyle}>
        <OfficialHeader />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={cardStyle}>
            <h2 style={{ color: '#000080', fontSize: '1.5rem', marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px', fontFamily: 'Georgia, serif' }}>
              Instructions & Terms of Participation
            </h2>
            <div style={{ background: '#fafafa', padding: '20px', border: '1px solid #eee', maxHeight: '400px', overflowY: 'auto', fontSize: '0.95rem', color: '#333', lineHeight: '1.8' }}>
              <p><strong>1. Duration:</strong> Participants are allotted strictly <strong>8 minutes</strong> to complete the examination.</p>
              <p><strong>2. Attempts:</strong> Only a single attempt is authorized per participant. Submissions are final.</p>
              <p><strong>3. Format:</strong> The examination is conducted entirely online via this secure portal.</p>
              <p><strong>4. Schedule:</strong> The portal is open from Sunday, September 6 after 11:00 AM.</p>
              <p><strong>5. Proctoring:</strong> This is a highly secure examination. <strong>Video and screen recording</strong> permissions must be granted. The session is continuously monitored.</p>
              <p><strong>6. Violations:</strong> Exiting Fullscreen mode, switching tabs, or minimizing the browser will trigger an immediate warning. Failure to return within 60 seconds will result in forced auto-submission.</p>
              <p><strong>7. Certification:</strong> E-Certificates will be issued to authorized participants post-verification.</p>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setStage('setup')} style={{ padding: '12px 30px', background: '#000080', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer', textTransform: 'uppercase', fontWeight: 'bold' }}>
                Accept & Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'setup') {
    return (
      <div style={containerStyle}>
        <OfficialHeader />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ ...cardStyle, textAlign: 'center', maxWidth: '600px' }}>
            <h2 style={{ color: '#000080', fontSize: '1.5rem', marginBottom: '10px', fontFamily: 'Georgia, serif' }}>Proctoring Environment Setup</h2>
            <p style={{ color: '#555', marginBottom: '30px' }}>To maintain examination integrity, secure access to your camera and screen is required.</p>

            {(camError || screenError) && (
              <div style={{ background: '#fff3f3', borderLeft: '4px solid #cc0000', color: '#cc0000', padding: '15px', marginBottom: '20px', textAlign: 'left', fontSize: '0.9rem' }}>
                <strong>Access Denied:</strong> You must allow both Camera and Screen sharing to proceed. Please check your browser permissions.
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
              <div style={{ flex: 1, background: camStream ? '#f0f9f0' : '#f9f9f9', padding: '20px', border: `1px solid ${camStream ? '#138808' : '#ddd'}` }}>
                <Camera size={32} color={camStream ? "#138808" : "#888"} style={{ marginBottom: '10px' }} />
                <div style={{ fontWeight: 'bold', color: camStream ? '#138808' : '#555' }}>{camStream ? 'Camera Authorized' : 'Camera Pending'}</div>
              </div>
              <div style={{ flex: 1, background: screenStream ? '#f0f9f0' : '#f9f9f9', padding: '20px', border: `1px solid ${screenStream ? '#138808' : '#ddd'}` }}>
                <Monitor size={32} color={screenStream ? "#138808" : "#888"} style={{ marginBottom: '10px' }} />
                <div style={{ fontWeight: 'bold', color: screenStream ? '#138808' : '#555' }}>{screenStream ? 'Screen Authorized' : 'Screen Pending'}</div>
              </div>
            </div>

            {camStream && (
              <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', border: '1px solid #ccc', marginBottom: '20px', background: '#000' }} />
            )}

            {(!camStream || !screenStream) ? (
              <button onClick={requestPermissions} style={{ width: '100%', padding: '15px', background: '#000080', color: 'white', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase' }}>
                Grant Authorizations
              </button>
            ) : (
              <button onClick={startQuiz} style={{ width: '100%', padding: '15px', background: '#138808', color: 'white', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase' }}>
                Enter Secure Fullscreen & Start
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
        <div style={{ minHeight: '100vh', background: '#cc0000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
          <div style={{ background: 'white', padding: '40px', textAlign: 'center', maxWidth: '500px', borderTop: '5px solid #000080' }}>
            <AlertTriangle size={60} color="#cc0000" style={{ marginBottom: '20px' }} />
            <h2 style={{ fontSize: '1.8rem', color: '#cc0000', marginBottom: '10px', fontFamily: 'Georgia, serif' }}>SECURITY VIOLATION</h2>
            <p style={{ fontSize: '1rem', color: '#333', marginBottom: '20px' }}>You have exited the secure fullscreen environment or changed tabs. This is a strict violation of examination protocols.</p>
            <div style={{ background: '#fff0f0', padding: '15px', border: '1px solid #ffcccc', color: '#cc0000', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '20px' }}>
              Auto-submission in: {graceTimeLeft} seconds
            </div>
            <button onClick={startQuiz} style={{ padding: '12px 24px', background: '#000080', color: 'white', border: 'none', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase' }}>
              Return to Examination Immediately
            </button>
          </div>
        </div>
      );
    }

    const currentQuestion = QUESTIONS[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1;

    return (
      <div style={containerStyle}>
        <OfficialHeader />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '900px', width: '100%', margin: '0 auto', padding: '30px 20px' }}>
          
          <div style={{ background: 'white', padding: '15px 20px', border: '1px solid #ddd', borderLeft: '4px solid #FF9933', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem', textTransform: 'uppercase' }}>
              Question {currentQuestionIndex + 1} of {QUESTIONS.length}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: timeLeft < 60 ? '#cc0000' : '#000080', fontWeight: 'bold', fontSize: '1rem' }}>
              <Clock size={18} /> Time Remaining: {formatTime(timeLeft)}
            </div>
          </div>

          <div style={{ background: 'white', padding: '40px', border: '1px solid #ddd', borderTop: '4px solid #000080', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 30px 0', fontSize: '1.3rem', color: '#111', lineHeight: '1.6', fontFamily: 'Georgia, serif' }}>
              {currentQuestion.text}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
              {currentQuestion.options.map((opt, i) => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 20px', border: answers[currentQuestion.id] === opt ? '2px solid #000080' : '1px solid #ddd', background: answers[currentQuestion.id] === opt ? '#f4f6fc' : 'white', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name={`question-${currentQuestion.id}`} 
                    value={opt} 
                    checked={answers[currentQuestion.id] === opt} 
                    onChange={() => setAnswers({...answers, [currentQuestion.id]: opt})}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '1rem', color: '#333', fontWeight: answers[currentQuestion.id] === opt ? 'bold' : 'normal' }}>
                    <span style={{ fontWeight: 'bold', marginRight: '10px' }}>{String.fromCharCode(65 + i)}.</span> {opt}
                  </span>
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
              {isLastQuestion ? (
                <button onClick={handleFinalSubmit} style={{ padding: '12px 30px', background: '#138808', color: 'white', border: 'none', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase' }}>
                  Final Submit
                </button>
              ) : (
                <button onClick={() => setCurrentQuestionIndex(i => i + 1)} style={{ padding: '12px 30px', background: '#000080', color: 'white', border: 'none', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase' }}>
                  Save & Next Question
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
      <div style={containerStyle}>
        <OfficialHeader />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ ...cardStyle, textAlign: 'center', maxWidth: '500px' }}>
            <div style={{ width: '50px', height: '50px', border: '4px solid #eee', borderTopColor: '#000080', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px auto' }}></div>
            <h2 style={{ color: '#000080', marginBottom: '10px', fontFamily: 'Georgia, serif' }}>Processing Submission</h2>
            <p style={{ color: '#555', fontSize: '0.9rem' }}>Securely transmitting encrypted data and video logs to the server. Do not close this window.</p>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'done') {
    return (
      <div style={containerStyle}>
        <OfficialHeader />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ ...cardStyle, textAlign: 'center', maxWidth: '600px' }}>
            <CheckCircle size={60} color="#138808" style={{ margin: '0 auto 20px auto' }} />
            <h2 style={{ color: '#000080', fontSize: '1.6rem', marginBottom: '15px', fontFamily: 'Georgia, serif' }}>Submission Successful</h2>
            <div style={{ width: '60px', height: '3px', background: '#138808', margin: '0 auto 20px auto' }}></div>
            <p style={{ color: '#333', fontSize: '1rem', lineHeight: '1.6' }}>Your examination data and proctoring logs have been securely submitted to the authorities.</p>
            <p style={{ color: '#777', fontSize: '0.9rem', marginTop: '20px' }}>You may now safely close this browser window.</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PublicQuiz;
