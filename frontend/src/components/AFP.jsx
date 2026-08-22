import React, { useState, useEffect } from 'react';
import { ref, onValue, push, set } from 'firebase/database';
import { database, auth } from '../firebaseConfig';
import { Award, CheckCircle, Clock, Check, X as XIcon, HelpCircle, FileText } from 'lucide-react';
import { API_URL } from '../config';

const AFP = () => {
  const [assessments, setAssessments] = useState([]);
  const [selectedAfp, setSelectedAfp] = useState(null);
  const [mode, setMode] = useState(null); // 'practice' or 'quiz'
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { qIndex: user_answer_string }
  const [feedback, setFeedback] = useState({}); // { qIndex: { correct: true/false, text: "explanation" } }
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [pastSubmissions, setPastSubmissions] = useState([]);

  useEffect(() => {
    const afpRef = ref(database, 'dna_assessments');
    const unsub = onValue(afpRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => {
          let parsedData = data[key];
          // If questions are a string (old DNA format), we try to parse it if it's JSON, else leave it
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

  const handleModeSelect = (afp, selectedMode) => {
    setSelectedAfp(afp);
    setMode(selectedMode);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setFeedback({});
    setQuizResults(null);
  };

  const handleAnswerChange = (qIndex, value) => {
    setAnswers(prev => ({ ...prev, [qIndex]: value }));
  };

  const checkAnswerPractice = async (qIndex) => {
    const q = selectedAfp.questionsList[qIndex];
    const userAns = answers[qIndex];
    if (!userAns) return;

    setIsSubmitting(true);
    let isCorrect = false;
    let feedbackText = '';

    if (q.type === 'mcq' || q.type === 'true_false') {
      isCorrect = userAns === q.correctAnswer;
      feedbackText = isCorrect ? "Correct!" : `Incorrect. The correct answer was: ${q.correctAnswer}`;
    } else {
      // Use AI Grader
      try {
        const res = await fetch(`${API_URL}/ai/grade`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: q.question,
            answer: userAns,
            expectedAnswer: q.correctAnswer
          })
        });
        const data = await res.json();
        isCorrect = data.correct;
        feedbackText = data.feedback || (isCorrect ? "Good job!" : "Needs improvement.");
      } catch(e) {
        isCorrect = false;
        feedbackText = "Error grading answer.";
      }
    }

    setFeedback(prev => ({ ...prev, [qIndex]: { correct: isCorrect, text: feedbackText } }));
    setIsSubmitting(false);
  };

  const submitQuiz = async () => {
    if (!window.confirm("Are you sure you want to submit your exam?")) return;
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
    const passed = scorePercent >= 60; // 60% passing

    // Save to Firebase
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


  const renderQuestion = (q, index) => {
    const hasFeedback = feedback[index];
    
    return (
      <div key={index} style={{ background: 'rgba(0,0,0,0.3)', padding: '25px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#e2e8f0', fontSize: '1.1rem', lineHeight: '1.5' }}>
          {index + 1}. {q.question}
        </h3>
        
        {q.type === 'mcq' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {q.options.map((opt, i) => (
              <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', cursor: 'pointer', border: answers[index] === opt ? '1px solid #3b82f6' : '1px solid transparent' }}>
                <input type="radio" name={`q-${index}`} value={opt} checked={answers[index] === opt} onChange={() => handleAnswerChange(index, opt)} disabled={hasFeedback && mode === 'practice'} style={{ accentColor: '#3b82f6' }} />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        )}

        {(q.type === 'short_answer' || q.type === 'code' || q.type === 'fill') && (
          <textarea 
            value={answers[index] || ''} 
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            disabled={hasFeedback && mode === 'practice'}
            placeholder="Type your answer here..."
            style={{ width: '100%', minHeight: '100px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '15px', borderRadius: '8px', fontFamily: q.type === 'code' ? 'monospace' : 'inherit' }}
          />
        )}

        {mode === 'practice' && !hasFeedback && (
          <button onClick={() => checkAnswerPractice(index)} disabled={!answers[index] || isSubmitting} style={{ marginTop: '15px', background: '#3b82f6', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer' }}>
            {isSubmitting ? 'Checking...' : 'Check Answer'}
          </button>
        )}

        {hasFeedback && (
          <div style={{ marginTop: '15px', padding: '15px', borderRadius: '8px', background: hasFeedback.correct ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: hasFeedback.correct ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            {hasFeedback.correct ? <CheckCircle color="#10b981" size={20} /> : <XIcon color="#ef4444" size={20} />}
            <span style={{ color: hasFeedback.correct ? '#10b981' : '#ef4444', lineHeight: '1.4' }}>{hasFeedback.text}</span>
          </div>
        )}
      </div>
    );
  };


  if (selectedAfp) {
    if (selectedAfp.isOldFormat) {
      return (
        <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto', color: 'white' }}>
          <button onClick={() => setSelectedAfp(null)} style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', marginBottom: '20px' }}>← Back to Assignments</button>
          <h2>{selectedAfp.chapter}</h2>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '25px', borderRadius: '12px', whiteSpace: 'pre-wrap' }}>
            {selectedAfp.questions}
          </div>
          <p style={{ color: '#f59e0b', marginTop: '20px' }}>This is an old format assignment and cannot be taken in Practice/Quiz mode.</p>
        </div>
      );
    }

    return (
      <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto', color: 'white' }}>
        <button onClick={() => setSelectedAfp(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', marginBottom: '20px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '5px' }}>← Exit {mode === 'quiz' ? 'Quiz' : 'Practice'}</button>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div>
            <h2 style={{ margin: '0 0 5px 0', color: '#f8fafc' }}>{selectedAfp.chapter || selectedAfp.title}</h2>
            <span style={{ color: '#3b82f6', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px' }}>{mode} MODE</span>
          </div>
          <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '5px 15px', borderRadius: '20px', fontWeight: 600 }}>{selectedAfp.xp} XP</span>
        </div>

        {quizResults && (
          <div style={{ background: quizResults.passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '30px', borderRadius: '12px', textAlign: 'center', marginBottom: '30px', border: quizResults.passed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)' }}>
            <h2 style={{ color: quizResults.passed ? '#10b981' : '#ef4444', margin: '0 0 10px 0' }}>
              {quizResults.passed ? 'Exam Passed!' : 'Exam Failed'}
            </h2>
            <p style={{ fontSize: '1.2rem', margin: '0 0 10px 0' }}>Score: <strong>{quizResults.score}%</strong></p>
            {quizResults.passed ? (
              <p style={{ color: '#94a3b8' }}>You earned {selectedAfp.xp} XP!</p>
            ) : (
              <p style={{ color: '#94a3b8' }}>You need 60% to pass. Review your answers below and try again.</p>
            )}
          </div>
        )}

        <div>
          {selectedAfp.questionsList.map((q, i) => renderQuestion(q, i))}
        </div>

        {mode === 'quiz' && !quizResults && (
          <button 
            onClick={submitQuiz} 
            disabled={isSubmitting}
            style={{ width: '100%', padding: '15px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}
          >
            {isSubmitting ? 'Grading Exam...' : 'Submit Exam'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', color: 'white', width: '100%' }}>
      <h1 style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', color: '#f8fafc', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
        <FileText color="#3b82f6" size={32} /> Assignments for Practice Exam (AFP)
      </h1>

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
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button onClick={() => handleModeSelect(afp, 'practice')} style={{ flex: 1, padding: '10px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                    Practice Mode
                  </button>
                  <button onClick={() => handleModeSelect(afp, 'quiz')} style={{ flex: 1, padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                    Quiz Mode
                  </button>
                </div>
              )}
            </div>
          )
        })}
        {assessments.length === 0 && (
          <div style={{ color: '#94a3b8' }}>No assignments available right now.</div>
        )}
      </div>
    </div>
  );
};

export default AFP;
