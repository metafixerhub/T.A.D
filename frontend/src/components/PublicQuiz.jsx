import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, ShieldCheck, CheckCircle, Clock } from 'lucide-react';
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
const EMBLEM_URL = "https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg";

const PublicQuiz = () => {
  const [stage, setStage] = useState('welcome'); // welcome | terms | quiz | submitting | done
  const [participantName, setParticipantName] = useState('');
  
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(480);
  
  const [graceTimeLeft, setGraceTimeLeft] = useState(60);
  const [isViolation, setIsViolation] = useState(false);
  const graceTimerRef = useRef(null);

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

  const startQuiz = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch (err) {
      console.warn("Fullscreen request failed", err);
    }
    setStage('quiz');
  };

  const handleOptionSelect = (option) => {
    const qId = QUESTIONS[currentQuestionIndex].id;
    setAnswers(prev => ({ ...prev, [qId]: option }));

    // Auto advance after short delay
    setTimeout(() => {
      if (currentQuestionIndex < QUESTIONS.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 600);
  };

  const handleFinalSubmit = async () => {
    setStage('submitting');
    clearInterval(graceTimerRef.current);
    
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(e => console.warn(e));
    }

    let score = 0;
    QUESTIONS.forEach(q => {
      if (answers[q.id] === q.answer) score += 1;
    });

    try {
      await fetch(`${API_URL}/quiz-submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: participantName,
          score: score,
          total: QUESTIONS.length,
          answers: answers,
          camVideoUrl: null, // Removed proctoring
          screenVideoUrl: null // Removed proctoring
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
    <div style={{ background: '#ffffff', width: '100%', borderTop: '6px solid #FF9933', borderBottom: '6px solid #138808', padding: '15px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <img src={EMBLEM_URL} alt="Emblem of India" style={{ height: '70px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Georgia, serif' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#000080' }}>भारत सरकार</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000080' }}>GOVERNMENT OF INDIA</span>
        </div>
      </div>
      <img src={quizLogo} alt="Quiz Logo" style={{ height: '70px', objectFit: 'contain' }} />
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
            <h2 style={{ color: '#000080', fontSize: '1.5rem', marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px', fontFamily: 'Georgia, serif', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={28} color="#138808" /> Instructions & Terms of Participation
            </h2>
            <div style={{ background: '#fafafa', padding: '20px', border: '1px solid #eee', maxHeight: '400px', overflowY: 'auto', fontSize: '0.95rem', color: '#333', lineHeight: '1.8' }}>
              <p><strong>1. Duration:</strong> Participants are allotted strictly <strong>8 minutes</strong> to complete the examination.</p>
              <p><strong>2. Attempts:</strong> Only a single attempt is authorized per participant. Submissions are final.</p>
              <p><strong>3. Format:</strong> The examination is conducted entirely online via this secure portal.</p>
              <p><strong>4. Schedule:</strong> The portal is open from Sunday, September 6 after 11:00 AM.</p>
              <p><strong>5. Proctoring:</strong> This is a secure examination. The session requires you to be in Fullscreen mode at all times.</p>
              <p><strong>6. Violations:</strong> Exiting Fullscreen mode, switching tabs, or minimizing the browser will trigger an immediate warning. Failure to return within 60 seconds will result in forced auto-submission.</p>
              <p><strong>7. Certification:</strong> E-Certificates will be issued to authorized participants post-verification.</p>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={startQuiz} style={{ padding: '12px 30px', background: '#000080', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer', textTransform: 'uppercase', fontWeight: 'bold' }}>
                Accept & Start Exam in Fullscreen
              </button>
            </div>
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
            <AlertTriangle size={60} color="#cc0000" style={{ margin: '0 auto 20px auto' }} />
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
                    onChange={() => handleOptionSelect(opt)}
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
                <button 
                  onClick={() => setCurrentQuestionIndex(i => i + 1)} 
                  disabled={!answers[currentQuestion.id]}
                  style={{ padding: '12px 30px', background: answers[currentQuestion.id] ? '#000080' : '#ccc', color: 'white', border: 'none', fontSize: '1rem', fontWeight: 'bold', cursor: answers[currentQuestion.id] ? 'pointer' : 'not-allowed', textTransform: 'uppercase' }}>
                  Skip to Next Question
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
            <p style={{ color: '#555', fontSize: '0.9rem' }}>Securely transmitting encrypted data to the server. Do not close this window.</p>
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
            <p style={{ color: '#333', fontSize: '1rem', lineHeight: '1.6' }}>Your examination data has been securely submitted to the authorities.</p>
            <p style={{ color: '#777', fontSize: '0.9rem', marginTop: '20px' }}>You may now safely close this browser window.</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PublicQuiz;
