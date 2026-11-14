import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Send, 
  RefreshCw, 
  Check, 
  AlertCircle, 
  Printer, 
  ShieldCheck, 
  BookOpen, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { PRE_EXAM_METADATA, PRE_EXAM_QUESTIONS } from '../data/preExamQuestions';

const API_URL = import.meta.env.VITE_BACKEND_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : 'https://t-a-d.onrender.com/api');

export default function PreExamPortal() {
  // Test State
  const [stage, setStage] = useState('welcome'); // 'welcome' | 'exam' | 'submitted'
  const [candidateName, setCandidateName] = useState('');
  const [nameError, setNameError] = useState('');
  
  // Question & Answers
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qId]: { selected: 'B', isCorrect: true, marks: 3 } }
  const [showHint, setShowHint] = useState({}); // { [qId]: boolean }
  const [aiExplanations, setAiExplanations] = useState({}); // { [qId]: string }
  const [loadingAi, setLoadingAi] = useState(false);
  const [userSpeechQuery, setUserSpeechQuery] = useState('');
  const [isListeningMic, setIsListeningMic] = useState(false);
  
  // Audio Speech (TTS)
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Time Tracker
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  const speechRecognitionRef = useRef(null);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (stage === 'exam') {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stage]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
    };
  }, []);

  const currentQ = PRE_EXAM_QUESTIONS[currentIndex];
  const isAnswered = !!userAnswers[currentQ.id];

  // Calculate live score
  const scoreCalculated = Object.values(userAnswers).reduce((sum, item) => sum + (item.marks || 0), 0);
  const correctCount = Object.values(userAnswers).filter(item => item.isCorrect).length;
  const wrongCount = Object.values(userAnswers).filter(item => !item.isCorrect).length;

  // Format seconds to mm:ss
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start Exam
  const handleStartExam = (e) => {
    e.preventDefault();
    if (!candidateName.trim()) {
      setNameError('Please enter your full name to begin the exam.');
      return;
    }
    setNameError('');
    setStage('exam');
  };

  // Select Option
  const handleSelectOption = (key) => {
    if (isAnswered) return; // Prevent changing answer once evaluated

    const isCorrect = key === currentQ.correctAnswer;
    const marksAwarded = isCorrect ? currentQ.marks : 0;

    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        selected: key,
        isCorrect,
        marks: marksAwarded,
        maxMarks: currentQ.marks,
        qNum: currentQ.qNum,
        question: currentQ.question,
        section: currentQ.section,
        correctOption: currentQ.correctAnswer
      }
    }));
  };

  // Text-To-Speech (Speaker)
  const handleSpeakText = (textToRead) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSpeakCurrentQuestion = () => {
    const text = `Question ${currentQ.qNum}: ${currentQ.question}. Option A: ${currentQ.options.A}. Option B: ${currentQ.options.B}. Option C: ${currentQ.options.C}. Option D: ${currentQ.options.D}.`;
    handleSpeakText(text);
  };

  // Speech Recognition (Mic)
  const handleToggleMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListeningMic) {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      setIsListeningMic(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListeningMic(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserSpeechQuery(transcript);
        fetchAiExplanation(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListeningMic(false);
      };

      recognition.onend = () => {
        setIsListeningMic(false);
      };

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setIsListeningMic(false);
    }
  };

  // Fetch AI Explanation
  const fetchAiExplanation = async (customQuery = '') => {
    setLoadingAi(true);

    try {
      const res = await fetch(`${API_URL}/pre-exam/ai-explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQ.question,
          options: currentQ.options,
          correctAnswer: currentQ.correctAnswer,
          explanation: currentQ.explanation,
          userQuery: customQuery || userSpeechQuery
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiExplanations(prev => ({
          ...prev,
          [currentQ.id]: data.reply || currentQ.aiDeepReview
        }));
      } else {
        setAiExplanations(prev => ({
          ...prev,
          [currentQ.id]: currentQ.aiDeepReview
        }));
      }
    } catch (err) {
      console.warn('AI explain fallback:', err.message);
      setAiExplanations(prev => ({
        ...prev,
        [currentQ.id]: currentQ.aiDeepReview
      }));
    } finally {
      setLoadingAi(false);
    }
  };

  // Submit Entire Exam to MongoDB
  const handleSubmitExam = async () => {
    if (isSubmitting) return;

    const unansweredCount = PRE_EXAM_QUESTIONS.length - Object.keys(userAnswers).length;
    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unansweredCount} unanswered question(s). Are you sure you want to finish and submit the test now?`
      );
      if (!confirmSubmit) return;
    }

    setIsSubmitting(true);

    // Prepare full answers list
    const answersList = PRE_EXAM_QUESTIONS.map(q => {
      const ans = userAnswers[q.id];
      return {
        qNum: q.qNum,
        question: q.question,
        section: q.section,
        selectedOption: ans ? ans.selected : 'Unanswered',
        correctOption: q.correctAnswer,
        isCorrect: ans ? ans.isCorrect : false,
        marksAwarded: ans ? ans.marks : 0,
        maxMarks: q.marks,
        explanation: q.explanation
      };
    });

    const finalScore = answersList.reduce((acc, a) => acc + a.marksAwarded, 0);
    const percentage = Number(((finalScore / PRE_EXAM_METADATA.totalMarks) * 100).toFixed(1));

    const submissionPayload = {
      testId: PRE_EXAM_METADATA.testId,
      testTitle: `${PRE_EXAM_METADATA.title} - ${PRE_EXAM_METADATA.subtitle}`,
      name: candidateName.trim(),
      score: finalScore,
      maxScore: PRE_EXAM_METADATA.totalMarks,
      percentage: percentage,
      totalQuestions: PRE_EXAM_METADATA.totalQuestions,
      correctCount: answersList.filter(a => a.isCorrect).length,
      wrongCount: answersList.filter(a => !a.isCorrect && a.selectedOption !== 'Unanswered').length,
      answers: answersList,
      timeSpentSeconds: elapsedSeconds
    };

    try {
      const response = await fetch(`${API_URL}/pre-exam/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionPayload)
      });

      const data = await response.json();
      setSubmissionResult(data.submission || submissionPayload);
      setStage('submitted');
    } catch (err) {
      console.error('Submission error:', err);
      // Even if network drops, present the score immediately to the student
      setSubmissionResult(submissionPayload);
      setStage('submitted');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // RENDER: WELCOME / NAME ENTRY SCREEN
  // ==========================================
  if (stage === 'welcome') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #090e17 0%, #0d1527 50%, #111a33 100%)',
        color: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          maxWidth: '860px',
          width: '100%',
          background: 'rgba(17, 24, 39, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '24px',
          padding: '28px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(59, 130, 246, 0.15)'
        }}>
          
          {/* Official Center Banner Image */}
          <div style={{
            borderRadius: '18px',
            overflow: 'hidden',
            marginBottom: '28px',
            border: '1px solid rgba(59, 130, 246, 0.35)',
            boxShadow: '0 12px 35px -5px rgba(0, 0, 0, 0.6), 0 0 25px rgba(59, 130, 246, 0.2)'
          }}>
            <img
              src="/pre-exam-banner.png"
              alt="I REMEMBER TEST - Pre-exams Recommended by the Center (14-Nov-26)"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
          </div>

          {/* Candidate Name Form Box */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '24px 28px'
          }}>
            <form onSubmit={handleStartExam}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#e2e8f0',
                  marginBottom: '10px'
                }}>
                  Candidate Full Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => {
                    setCandidateName(e.target.value);
                    if (nameError) setNameError('');
                  }}
                  placeholder="Enter candidate full name to begin the assessment..."
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    background: 'rgba(10, 16, 30, 0.9)',
                    border: nameError ? '1.5px solid #ef4444' : '1px solid rgba(59, 130, 246, 0.4)',
                    color: '#ffffff',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.4)',
                    transition: 'border 0.2s, box-shadow 0.2s'
                  }}
                />
                {nameError && (
                  <div style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertCircle size={15} /> {nameError}
                  </div>
                )}
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  fontSize: '17px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.5)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Start Examination Now <ArrowRight size={20} />
              </button>
            </form>

            {/* Footer Link to Admin Controller */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Link
                to="/test/001-haited/-Pre-exams-recommended-by-the-center/14-nov-26/admin"
                style={{
                  color: '#64748b',
                  fontSize: '13px',
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#93c5fd'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
              >
                Center Administration Portal (Candidate Score Records) →
              </Link>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: SUBMITTED / RESULT SCREEN
  // ==========================================
  if (stage === 'submitted' && submissionResult) {
    const isPassing = submissionResult.percentage >= 50;
    const isDistinction = submissionResult.percentage >= 75;

    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #090e17 0%, #0d1527 50%, #111a33 100%)',
        color: '#f8fafc',
        padding: '40px 16px',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          {/* Card */}
          <div style={{
            background: 'rgba(17, 24, 39, 0.9)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '24px',
            padding: '36px',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)',
            marginBottom: '32px'
          }}>
            {/* Top Badge */}
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 18px',
                borderRadius: '9999px',
                background: isPassing ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: `1px solid ${isPassing ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                color: isPassing ? '#34d399' : '#f87171',
                fontSize: '13px',
                fontWeight: 600,
                textTransform: 'uppercase'
              }}>
                <Award size={16} /> Examination Completed & Saved to Database
              </span>
            </div>

            <h1 style={{
              fontSize: '32px',
              fontWeight: 800,
              textAlign: 'center',
              marginBottom: '6px',
              color: '#ffffff'
            }}>
              Test Result Scorecard
            </h1>

            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '15px', marginBottom: '28px' }}>
              Candidate: <strong style={{ color: '#e2e8f0' }}>{submissionResult.name}</strong> · Code: {PRE_EXAM_METADATA.testCode}
            </p>

            {/* Score Highlight Box */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'radial-gradient(circle at center, rgba(37, 99, 235, 0.15) 0%, rgba(15, 23, 42, 0.8) 70%)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '20px',
              padding: '32px 20px',
              marginBottom: '32px'
            }}>
              <div style={{ fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Marks Obtained
              </div>
              <div style={{
                fontSize: '64px',
                fontWeight: 900,
                color: isPassing ? '#38bdf8' : '#f87171',
                lineHeight: 1.1,
                marginTop: '8px'
              }}>
                {submissionResult.score} <span style={{ fontSize: '28px', color: '#64748b', fontWeight: 500 }}>/ {submissionResult.maxScore}</span>
              </div>
              <div style={{
                marginTop: '8px',
                fontSize: '20px',
                fontWeight: 700,
                color: isDistinction ? '#34d399' : isPassing ? '#60a5fa' : '#ef4444'
              }}>
                {submissionResult.percentage}% · {isDistinction ? 'Distinction' : isPassing ? 'Passed' : 'Needs Practice'}
              </div>
            </div>

            {/* Detailed Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '14px',
              marginBottom: '32px'
            }}>
              <div style={{
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '14px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ color: '#10b981', fontSize: '24px', fontWeight: 700 }}>{submissionResult.correctCount}</div>
                <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>Correct Questions</div>
              </div>

              <div style={{
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '14px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ color: '#ef4444', fontSize: '24px', fontWeight: 700 }}>{submissionResult.wrongCount}</div>
                <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>Wrong Questions</div>
              </div>

              <div style={{
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '14px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ color: '#f59e0b', fontSize: '24px', fontWeight: 700 }}>
                  {formatTime(submissionResult.timeSpentSeconds || elapsedSeconds)}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>Time Taken</div>
              </div>

              <div style={{
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '14px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ color: '#818cf8', fontSize: '24px', fontWeight: 700 }}>37</div>
                <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>Total Questions</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => window.print()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 22px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  cursor: 'pointer'
                }}
              >
                <Printer size={16} /> Print Scorecard
              </button>

              <Link
                to="/test/001-haited/-Pre-exams-recommended-by-the-center/14-nov-26/admin"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 22px',
                  borderRadius: '12px',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                Center Admin View <ChevronRight size={16} />
              </Link>

              <button
                onClick={() => {
                  setStage('welcome');
                  setUserAnswers({});
                  setCurrentIndex(0);
                  setElapsedSeconds(0);
                  setSubmissionResult(null);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 22px',
                  borderRadius: '12px',
                  background: 'transparent',
                  color: '#94a3b8',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={16} /> Retake Test
              </button>
            </div>
          </div>

          {/* Question by Question Review Accordion / List */}
          <div style={{
            background: 'rgba(17, 24, 39, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '28px'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', color: '#f8fafc' }}>
              Detailed Question-by-Question Review
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {submissionResult.answers?.map((ans, idx) => (
                <div
                  key={idx}
                  style={{
                    background: ans.isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                    border: `1px solid ${ans.isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    borderRadius: '14px',
                    padding: '18px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#94a3b8' }}>
                      Q{ans.qNum} · {ans.section}
                    </span>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '9999px',
                      background: ans.isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: ans.isCorrect ? '#34d399' : '#f87171'
                    }}>
                      {ans.isCorrect ? <Check size={13} /> : <XCircle size={13} />}
                      {ans.marksAwarded} / {ans.maxMarks} Marks
                    </span>
                  </div>

                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#f1f5f9', marginBottom: '12px' }}>
                    {ans.question}
                  </div>

                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                    fontSize: '13px',
                    marginBottom: '10px'
                  }}>
                    <span style={{ color: '#cbd5e1' }}>
                      Your Answer: <strong style={{ color: ans.isCorrect ? '#34d399' : '#f87171' }}>Option {ans.selectedOption}</strong>
                    </span>
                    {!ans.isCorrect && (
                      <span style={{ color: '#38bdf8' }}>
                        Correct Answer: <strong>Option {ans.correctOption}</strong>
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '12px', color: '#94a3b8', background: 'rgba(0, 0, 0, 0.25)', padding: '10px 12px', borderRadius: '8px' }}>
                    💡 <strong>Explanation:</strong> {ans.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: ACTIVE EXAMINATION SCREEN
  // ==========================================
  const selectedObj = userAnswers[currentQ.id];
  const userHasAnswered = !!selectedObj;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #090e17 0%, #0d1527 50%, #111a33 100%)',
      color: '#f8fafc',
      padding: '20px 16px',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        
        {/* Top Header Navigation Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          background: 'rgba(17, 24, 39, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '14px 20px',
          marginBottom: '20px'
        }}>
          <div>
            <div style={{ fontSize: '12px', color: '#60a5fa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {PRE_EXAM_METADATA.title} · {PRE_EXAM_METADATA.testCode}
            </div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#f1f5f9' }}>
              Candidate: <span style={{ color: '#38bdf8' }}>{candidateName}</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '14px' }}>
              <Clock size={16} /> {formatTime(elapsedSeconds)}
            </div>

            <div style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'rgba(37, 99, 235, 0.2)',
              border: '1px solid rgba(37, 99, 235, 0.4)',
              color: '#93c5fd',
              fontSize: '14px',
              fontWeight: 700
            }}>
              Score: {scoreCalculated} / 80
            </div>

            <button
              onClick={handleSubmitExam}
              disabled={isSubmitting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <Send size={14} /> Submit
            </button>
          </div>
        </div>

        {/* Progress Bar & Section Header */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>
              {currentQ.section}
            </span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8' }}>
              Question {currentIndex + 1} of {PRE_EXAM_QUESTIONS.length}
            </span>
          </div>

          <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{
              width: `${((currentIndex + 1) / PRE_EXAM_QUESTIONS.length) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #3b82f6 0%, #10b981 100%)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Main Question Card */}
        <div style={{
          background: 'rgba(17, 24, 39, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
          marginBottom: '20px'
        }}>
          {/* Question Top Tags & Audio Tool */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#60a5fa',
                fontSize: '12px',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '8px',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}>
                Q{currentQ.qNum}
              </span>

              <span style={{
                background: currentQ.marks === 3 ? 'rgba(168, 85, 247, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                color: currentQ.marks === 3 ? '#c084fc' : '#34d399',
                fontSize: '12px',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '8px'
              }}>
                +{currentQ.marks} Marks
              </span>
            </div>

            {/* Speaker Button to read Question Aloud */}
            <button
              onClick={handleSpeakCurrentQuestion}
              title={isSpeaking ? "Stop Speaking" : "Listen to Question (Speaker)"}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: isSpeaking ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                color: isSpeaking ? '#f87171' : '#cbd5e1',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
              {isSpeaking ? 'Stop Audio' : 'Listen Question'}
            </button>
          </div>

          {/* Question Prompt */}
          <h2 style={{
            fontSize: '20px',
            fontWeight: 700,
            lineHeight: 1.5,
            color: '#ffffff',
            marginBottom: '24px'
          }}>
            {currentQ.question}
          </h2>

          {/* MCQ Options List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {Object.entries(currentQ.options).map(([key, label]) => {
              const isSelected = selectedObj?.selected === key;
              const isCorrectKey = currentQ.correctAnswer === key;

              let cardBg = 'rgba(30, 41, 59, 0.4)';
              let borderColor = 'rgba(255, 255, 255, 0.1)';
              let textColor = '#e2e8f0';

              if (userHasAnswered) {
                if (isCorrectKey) {
                  cardBg = 'rgba(16, 185, 129, 0.2)';
                  borderColor = '#10b981';
                  textColor = '#34d399';
                } else if (isSelected && !selectedObj.isCorrect) {
                  cardBg = 'rgba(239, 68, 68, 0.2)';
                  borderColor = '#ef4444';
                  textColor = '#f87171';
                } else {
                  cardBg = 'rgba(30, 41, 59, 0.2)';
                  borderColor = 'rgba(255, 255, 255, 0.05)';
                  textColor = '#64748b';
                }
              }

              return (
                <div
                  key={key}
                  onClick={() => handleSelectOption(key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    borderRadius: '14px',
                    background: cardBg,
                    border: `1.5px solid ${borderColor}`,
                    cursor: userHasAnswered ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 4px 15px rgba(0, 0, 0, 0.3)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!userHasAnswered) {
                      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.6)';
                      e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!userHasAnswered) {
                      e.currentTarget.style.borderColor = borderColor;
                      e.currentTarget.style.background = cardBg;
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '14px',
                      background: isCorrectKey && userHasAnswered ? '#10b981' : isSelected && !selectedObj.isCorrect ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
                      color: '#ffffff'
                    }}>
                      {key}
                    </span>
                    <span style={{ fontSize: '15px', fontWeight: 500, color: textColor }}>
                      {label}
                    </span>
                  </div>

                  {userHasAnswered && isCorrectKey && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontWeight: 700, fontSize: '13px' }}>
                      <CheckCircle2 size={18} /> Correct
                    </span>
                  )}

                  {userHasAnswered && isSelected && !selectedObj.isCorrect && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444', fontWeight: 700, fontSize: '13px' }}>
                      <XCircle size={18} /> Incorrect
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Interactive Assistance Tools: Hint, AI Explanation, Mic, Speaker */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '10px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            {/* Hint Button */}
            <button
              onClick={() => setShowHint(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                background: showHint[currentQ.id] ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                color: '#fbbf24',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <HelpCircle size={15} /> {showHint[currentQ.id] ? 'Hide Hint' : '💡 Show Hint'}
            </button>

            {/* AI Explanation Button */}
            <button
              onClick={() => fetchAiExplanation()}
              disabled={loadingAi}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                color: '#c084fc',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Sparkles size={15} /> {loadingAi ? 'AI Thinking...' : '🤖 AI Explanation'}
            </button>

            {/* Voice Mic Button */}
            <button
              onClick={handleToggleMic}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                background: isListeningMic ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                border: isListeningMic ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                color: isListeningMic ? '#f87171' : '#cbd5e1',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {isListeningMic ? <MicOff size={15} /> : <Mic size={15} />}
              {isListeningMic ? 'Listening Voice...' : '🎙️ Mic (Ask AI)'}
            </button>
          </div>

          {/* Hint Card Box */}
          {showHint[currentQ.id] && (
            <div style={{
              marginTop: '16px',
              padding: '14px 18px',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '12px',
              fontSize: '14px',
              color: '#fef3c7'
            }}>
              💡 <strong>Hint:</strong> {currentQ.hint}
            </div>
          )}

          {/* Instant Evaluation Feedback Card */}
          {userHasAnswered && (
            <div style={{
              marginTop: '20px',
              padding: '18px 20px',
              background: selectedObj.isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              border: `1.5px solid ${selectedObj.isCorrect ? '#10b981' : '#ef4444'}`,
              borderRadius: '14px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{
                  fontWeight: 700,
                  fontSize: '15px',
                  color: selectedObj.isCorrect ? '#34d399' : '#f87171'
                }}>
                  {selectedObj.isCorrect ? `✓ Correct Answer! (+${currentQ.marks} Marks)` : `✕ Incorrect! Correct is Option ${currentQ.correctAnswer}`}
                </span>

                <button
                  onClick={() => handleSpeakText(currentQ.explanation)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  <Volume2 size={14} /> Listen
                </button>
              </div>

              <div style={{ color: '#e2e8f0', fontSize: '14px', lineHeight: '1.6' }}>
                {currentQ.explanation}
              </div>
            </div>
          )}

          {/* AI In-depth Review Card */}
          {aiExplanations[currentQ.id] && (
            <div style={{
              marginTop: '16px',
              padding: '18px 20px',
              background: 'rgba(147, 51, 234, 0.1)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              borderRadius: '14px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c084fc', fontWeight: 700, fontSize: '14px' }}>
                  <Sparkles size={16} /> AI Deep Tutor Review
                </div>

                <button
                  onClick={() => handleSpeakText(aiExplanations[currentQ.id])}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'transparent',
                    border: 'none',
                    color: '#c084fc',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  <Volume2 size={14} /> Read AI Aloud
                </button>
              </div>

              <div style={{ color: '#e9d5ff', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                {aiExplanations[currentQ.id]}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '28px'
        }}>
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '12px 20px',
              borderRadius: '12px',
              background: currentIndex === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
              color: currentIndex === 0 ? '#64748b' : '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <ChevronLeft size={18} /> Previous
          </button>

          {currentIndex < PRE_EXAM_QUESTIONS.length - 1 ? (
            <button
              onClick={() => setCurrentIndex(prev => Math.min(PRE_EXAM_QUESTIONS.length - 1, prev + 1))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '12px 24px',
                borderRadius: '12px',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Next Question <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmitExam}
              disabled={isSubmitting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 26px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)'
              }}
            >
              <Send size={16} /> Finish & Submit Test
            </button>
          )}
        </div>

        {/* Question Palette / Quick Jumper */}
        <div style={{
          background: 'rgba(17, 24, 39, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '20px'
        }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '12px' }}>
            Question Palette (37 Questions):
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(36px, 1fr))',
            gap: '8px'
          }}>
            {PRE_EXAM_QUESTIONS.map((q, idx) => {
              const ans = userAnswers[q.id];
              const isCurrent = idx === currentIndex;

              let btnBg = 'rgba(255, 255, 255, 0.05)';
              let border = '1px solid rgba(255, 255, 255, 0.1)';
              let txtColor = '#94a3b8';

              if (ans) {
                if (ans.isCorrect) {
                  btnBg = '#10b981';
                  border = '1px solid #059669';
                  txtColor = '#ffffff';
                } else {
                  btnBg = '#ef4444';
                  border = '1px solid #dc2626';
                  txtColor = '#ffffff';
                }
              }

              if (isCurrent) {
                border = '2px solid #38bdf8';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    height: '36px',
                    borderRadius: '8px',
                    background: btnBg,
                    border: border,
                    color: txtColor,
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {q.qNum}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
