import React, { useState, useEffect, useRef } from 'react';
import { ref, onValue, push } from 'firebase/database';
import { database, auth } from '../firebaseConfig';
import { Target, Timer, ChevronLeft, ChevronRight, Bookmark, MoreVertical, FileText, CheckCircle, X as XIcon } from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : 'https://t-a-d.onrender.com/api');

const AFP = () => {
  const [assessments, setAssessments] = useState([]);
  const [selectedAfp, setSelectedAfp] = useState(null);
  const [mode, setMode] = useState(null); // 'practice' or 'quiz'
  
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { qIndex: value }
  const [feedback, setFeedback] = useState({}); // { qIndex: { correct: true/false, text: "" } }
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [pastSubmissions, setPastSubmissions] = useState([]);

  const [timeElapsed, setTimeElapsed] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const afpRef = ref(database, 'dna_assessments');
    const unsub = onValue(afpRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => {
          let parsedData = data[key];
          if (typeof parsedData.questions === 'string') {
            try {
              parsedData.questionsList = JSON.parse(parsedData.questions);
            } catch (e) {
              parsedData.isOldFormat = true;
            }
          } else {
            parsedData.questionsList = parsedData.questions;
          }
          return { id: key, ...parsedData };
        });
        setAssessments(list.sort((a, b) => b.timestamp - a.timestamp));
      } else {
        setAssessments([]);
      }
    });

    if (auth.currentUser) {
      const subsRef = ref(database, 'dna_submissions');
      const unsubSubs = onValue(subsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list = Object.keys(data)
            .map(key => ({ id: key, ...data[key] }))
            .filter(s => s.userId === auth.currentUser.uid);
          setPastSubmissions(list);
        }
      });
      return () => { unsub(); unsubSubs(); };
    }

    return () => unsub();
  }, []);

  // Timer logic for Exam view
  useEffect(() => {
    if (mode && !quizResults) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode, quizResults]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleModeSelect = (afp, selectedMode) => {
    setSelectedAfp(afp);
    setMode(selectedMode);
    setCurrentQIndex(0);
    setAnswers({});
    setFeedback({});
    setQuizResults(null);
    setTimeElapsed(0);
  };

  const checkPracticeAnswer = async () => {
    const q = selectedAfp.questionsList[currentQIndex];
    const userAns = answers[currentQIndex];
    if (!userAns) return;

    setIsSubmitting(true);
    let isCorrect = false;
    let feedbackText = '';

    if (q.type === 'mcq' || q.type === 'true_false') {
      isCorrect = userAns === q.correctAnswer;
      feedbackText = isCorrect ? "Correct!" : `Incorrect. The correct answer was: ${q.correctAnswer}`;
    } else {
      try {
        const res = await fetch(`${API_URL}/ai/grade`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: q.question, answer: userAns, expectedAnswer: q.correctAnswer })
        });
        const data = await res.json();
        isCorrect = data.correct;
        feedbackText = data.feedback || (isCorrect ? "Good job!" : "Needs improvement.");
      } catch(e) {
        isCorrect = false;
        feedbackText = "Error grading answer.";
      }
    }

    setFeedback(prev => ({ ...prev, [currentQIndex]: { correct: isCorrect, text: feedbackText } }));
    setIsSubmitting(false);
  };

  const submitQuiz = async () => {
    if (!window.confirm("Are you sure you want to submit your AFP?")) return;
    setIsSubmitting(true);
    
    let correctCount = 0;
    const finalFeedback = {};

    for (let i = 0; i < selectedAfp.questionsList.length; i++) {
      const q = selectedAfp.questionsList[i];
      const userAns = answers[i] || "";
      
      let isCorrect = false;
      let text = '';

      if (q.type === 'mcq' || q.type === 'true_false') {
        isCorrect = userAns === q.correctAnswer;
        text = isCorrect ? "Correct" : `Wrong. Expected: ${q.correctAnswer}`;
      } else {
        try {
          const res = await fetch(`${API_URL}/ai/grade`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: q.question, answer: userAns, expectedAnswer: q.correctAnswer })
          });
          const data = await res.json();
          isCorrect = data.correct;
          text = data.feedback;
        } catch(e) {
          isCorrect = false;
          text = "Error grading.";
        }
      }
      
      if (isCorrect) correctCount++;
      finalFeedback[i] = { correct: isCorrect, text };
    }

    const scorePercent = Math.round((correctCount / selectedAfp.questionsList.length) * 100);
    const passed = scorePercent >= 60;

    try {
      await push(ref(database, 'dna_submissions'), {
        dnaId: selectedAfp.id,
        chapter: selectedAfp.chapter || selectedAfp.title,
        xpAwarded: passed ? selectedAfp.xp : 0,
        score: scorePercent,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        timestamp: Date.now(),
        mode: 'quiz'
      });
    } catch (e) {
      console.error(e);
    }

    setFeedback(finalFeedback);
    setQuizResults({ score: scorePercent, passed });
    setIsSubmitting(false);
  };

  // --- RENDER EXAM UI (LIGHT THEME MATCHING SCREENSHOT) ---
  if (selectedAfp && mode) {
    const qList = selectedAfp.questionsList;
    const currentQ = qList[currentQIndex];
    
    // Calculate Stats for right panel
    const totalQ = qList.length;
    const answeredCount = Object.keys(answers).length;
    const notAnsweredCount = totalQ - answeredCount;
    
    let correctCount = 0;
    let incorrectCount = 0;
    Object.values(feedback).forEach(fb => {
      if (fb.correct) correctCount++;
      else incorrectCount++;
    });

    const isLastQ = currentQIndex === totalQ - 1;

    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#f8fafc', zIndex: 9999, display: 'flex', flexDirection: 'column', color: '#1e293b', fontFamily: 'sans-serif' }}>
        
        {/* HEADER */}
        <div style={{ height: '70px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px' }}>
          <button onClick={() => setSelectedAfp(null)} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 600, color: '#475569' }}>
            <ChevronLeft size={20} /> Back
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: '#334155' }}>
            <Timer size={18} /> {formatTime(timeElapsed)}
          </div>
          
          <button onClick={submitQuiz} disabled={isSubmitting || quizResults} style={{ background: 'white', border: '1px solid #6366f1', color: '#6366f1', padding: '8px 24px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            {isSubmitting ? 'Grading...' : 'Submit AFP'}
          </button>
        </div>

        {quizResults ? (
          <div style={{ padding: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', textAlign: 'center', maxWidth: '500px', width: '100%' }}>
              <h1 style={{ color: quizResults.passed ? '#10b981' : '#ef4444', marginBottom: '20px' }}>
                {quizResults.passed ? 'Exam Passed!' : 'Exam Failed'}
              </h1>
              <p style={{ fontSize: '1.5rem', margin: '0 0 10px 0' }}>Score: <strong>{quizResults.score}%</strong></p>
              <p style={{ color: '#64748b', marginBottom: '30px' }}>{quizResults.passed ? `You earned ${selectedAfp.xp} XP!` : 'You need 60% to pass. Try again.'}</p>
              <button onClick={() => setSelectedAfp(null)} style={{ background: '#6366f1', color: 'white', padding: '12px 30px', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', fontWeight: 600 }}>Return to Dashboard</button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* LEFT PANEL (QUESTION) */}
            <div style={{ flex: 1, padding: '40px 60px', overflowY: 'auto', background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ background: '#475569', color: 'white', padding: '6px 14px', borderRadius: '4px', fontWeight: 'bold' }}>{currentQIndex + 1}</div>
                  <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.5px' }}>EASY</span>
                </div>
                <div style={{ display: 'flex', gap: '15px', color: '#64748b' }}>
                  <Bookmark size={20} cursor="pointer" />
                  <MoreVertical size={20} cursor="pointer" />
                </div>
              </div>

              <h2 style={{ fontSize: '1.4rem', margin: '0 0 10px 0', color: '#1e293b' }}>
                {currentQ.type === 'mcq' ? 'Multiple Choice' : currentQ.type === 'true_false' ? 'True / False' : currentQ.type === 'fill' ? 'Fill in the blanks' : 'Short Answer'}
              </h2>
              <p style={{ fontSize: '1.2rem', color: '#334155', lineHeight: '1.6', marginBottom: '30px', whiteSpace: 'pre-wrap' }}>{currentQ.question}</p>

              {/* INPUTS */}
              {currentQ.type === 'mcq' || currentQ.type === 'true_false' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '600px' }}>
                  {currentQ.options.map((opt, i) => (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 20px', border: answers[currentQIndex] === opt ? '2px solid #6366f1' : '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', background: answers[currentQIndex] === opt ? '#e0e7ff' : 'white', transition: 'all 0.2s' }}>
                      <input type="radio" name={`q-${currentQIndex}`} value={opt} checked={answers[currentQIndex] === opt} onChange={() => setAnswers(prev => ({...prev, [currentQIndex]: opt}))} disabled={feedback[currentQIndex] && mode === 'practice'} style={{ accentColor: '#6366f1', width: '18px', height: '18px' }} />
                      <span style={{ fontSize: '1.1rem', color: answers[currentQIndex] === opt ? '#4338ca' : '#334155', fontWeight: answers[currentQIndex] === opt ? 600 : 400 }}>{opt}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <textarea 
                  value={answers[currentQIndex] || ''} 
                  onChange={(e) => setAnswers(prev => ({...prev, [currentQIndex]: e.target.value}))}
                  disabled={feedback[currentQIndex] && mode === 'practice'}
                  placeholder="Type your answer here..."
                  style={{ width: '100%', maxWidth: '700px', minHeight: '150px', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1.1rem', resize: 'vertical', outline: 'none' }}
                />
              )}

              {/* FEEDBACK (Practice Mode) */}
              {feedback[currentQIndex] && mode === 'practice' && (
                <div style={{ marginTop: '25px', padding: '20px', borderRadius: '8px', background: feedback[currentQIndex].correct ? '#d1fae5' : '#fee2e2', display: 'flex', alignItems: 'flex-start', gap: '15px', maxWidth: '700px' }}>
                  {feedback[currentQIndex].correct ? <CheckCircle color="#059669" size={24} /> : <XIcon color="#dc2626" size={24} />}
                  <span style={{ color: feedback[currentQIndex].correct ? '#065f46' : '#991b1b', fontSize: '1.1rem', lineHeight: '1.5' }}>{feedback[currentQIndex].text}</span>
                </div>
              )}

              {/* BOTTOM NAVIGATION */}
              <div style={{ marginTop: '50px', borderTop: '1px solid #e2e8f0', paddingTop: '30px', display: 'flex', justifyContent: 'flex-end', maxWidth: '700px', gap: '15px' }}>
                {mode === 'practice' && !feedback[currentQIndex] ? (
                  <button onClick={checkPracticeAnswer} disabled={!answers[currentQIndex] || isSubmitting} style={{ background: '#6366f1', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: answers[currentQIndex] ? 'pointer' : 'not-allowed', opacity: answers[currentQIndex] ? 1 : 0.6 }}>
                    {isSubmitting ? 'Checking...' : 'Check Answer'}
                  </button>
                ) : (
                  <button onClick={() => setCurrentQIndex(prev => Math.min(totalQ - 1, prev + 1))} disabled={isLastQ} style={{ background: 'white', color: '#6366f1', border: '1px solid #6366f1', padding: '12px 40px', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: isLastQ ? 'not-allowed' : 'pointer', opacity: isLastQ ? 0.5 : 1 }}>
                    {mode === 'quiz' && !answers[currentQIndex] ? 'Skip' : 'Next'}
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT PANEL (NAVIGATOR) */}
            <div style={{ width: '350px', background: '#f8fafc', borderLeft: '1px solid #e2e8f0', padding: '30px', overflowY: 'auto' }}>
              
              {/* Badges */}
              {mode === 'practice' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '30px' }}>
                  <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                    <div style={{ background: '#10b981', color: 'white', width: '20px', height: '20px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>{correctCount}</div> Correct
                  </div>
                  <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                    <div style={{ background: '#ef4444', color: 'white', width: '20px', height: '20px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>{incorrectCount}</div> Incorrect
                  </div>
                  <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: 600, color: '#334155', gridColumn: 'span 2' }}>
                    <div style={{ background: '#94a3b8', color: 'white', width: '20px', height: '20px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>{totalQ - correctCount - incorrectCount}</div> Not Answered
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                  <div style={{ flex: 1, background: 'white', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                    <div style={{ background: '#3b82f6', color: 'white', width: '20px', height: '20px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>{answeredCount}</div> Answered
                  </div>
                  <div style={{ flex: 1, background: 'white', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                    <div style={{ background: '#94a3b8', color: 'white', width: '20px', height: '20px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>{notAnsweredCount}</div> Not Answered
                  </div>
                </div>
              )}

              {/* Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                {Array.from({length: totalQ}).map((_, idx) => {
                  let bgColor = 'white';
                  let textColor = '#475569';
                  let borderColor = '#cbd5e1';
                  
                  if (idx === currentQIndex) {
                    borderColor = '#6366f1';
                    textColor = '#6366f1';
                  }

                  if (mode === 'practice') {
                    if (feedback[idx]) {
                      bgColor = feedback[idx].correct ? '#10b981' : '#ef4444';
                      textColor = 'white';
                      borderColor = bgColor;
                    }
                  } else {
                    if (answers[idx]) {
                      bgColor = '#3b82f6';
                      textColor = 'white';
                      borderColor = bgColor;
                    }
                  }

                  return (
                    <button 
                      key={idx} 
                      onClick={() => setCurrentQIndex(idx)}
                      style={{ 
                        aspectRatio: '1', 
                        background: bgColor, 
                        color: textColor, 
                        border: `1px solid ${borderColor}`, 
                        borderRadius: '6px', 
                        fontSize: '1rem', 
                        fontWeight: 600, 
                        cursor: 'pointer',
                        boxShadow: idx === currentQIndex ? '0 0 0 2px rgba(99, 102, 241, 0.2)' : 'none'
                      }}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- RENDER DASHBOARD (DARK THEME) ---
  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', color: 'white', width: '100%' }}>
      <h1 style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', color: '#f8fafc', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
        <FileText color="#3b82f6" size={32} /> Assignments for Practice Exam (AFP)
      </h1>

      {selectedAfp && !mode ? (
        // MODE SELECTION UI (Yellow & Blue Cards matching Screenshot 1)
        <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: '16px', color: '#1e293b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Select a Mode</h2>
            <button onClick={() => setSelectedAfp(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><XIcon /></button>
          </div>
          
          {/* Practice Mode Card */}
          <div 
            onClick={() => handleModeSelect(selectedAfp, 'practice')}
            style={{ 
              background: '#fef9c3', // light yellow
              border: '2px solid #fde047',
              borderRadius: '12px', 
              padding: '25px', 
              marginBottom: '20px',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                Practice Mode
              </h3>
              <div style={{ background: '#1e293b', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <ChevronRight size={16} />
              </div>
            </div>
            <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', maxWidth: '70%', lineHeight: '1.5' }}>
              Get instant answers and solutions at question level
            </p>
            <Target size={80} color="#eab308" opacity={0.2} style={{ position: 'absolute', right: '-10px', bottom: '-10px' }} />
          </div>

          {/* Quiz Mode Card */}
          <div 
            onClick={() => handleModeSelect(selectedAfp, 'quiz')}
            style={{ 
              background: '#f0f9ff', // light blue
              border: '2px solid #bae6fd',
              borderRadius: '12px', 
              padding: '25px', 
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                Quiz Mode
              </h3>
              <div style={{ background: '#1e293b', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <ChevronRight size={16} />
              </div>
            </div>
            <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', maxWidth: '70%', lineHeight: '1.5' }}>
              Complete in the given time and get answers after DPP submission
            </p>
            <Timer size={80} color="#3b82f6" opacity={0.2} style={{ position: 'absolute', right: '-10px', bottom: '-10px' }} />
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
          {assessments.map(afp => {
            const sub = pastSubmissions.find(s => s.dnaId === afp.id);
            const isPassed = sub && sub.score >= 60;

            return (
              <div key={afp.id} style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: '16px', padding: '25px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#e2e8f0' }}>{afp.chapter || afp.title}</h3>
                  <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>{afp.xp} XP</span>
                </div>
                
                {isPassed ? (
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '15px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981' }}>
                    <CheckCircle size={20} />
                    <span>Completed (Score: {sub.score}%)</span>
                  </div>
                ) : (
                  <button onClick={() => setSelectedAfp(afp)} style={{ width: '100%', marginTop: '15px', padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                    Start Assignment
                  </button>
                )}
              </div>
            )
          })}
          {assessments.length === 0 && (
            <div style={{ color: '#94a3b8' }}>No assignments available right now.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AFP;
