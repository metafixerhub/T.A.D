import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { firestore, auth } from '../firebaseConfig';
import { Link } from 'react-router-dom';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('https://opentdb.com/api.php?amount=10&type=multiple')
      .then(res => res.json())
      .then(data => {
        if (data.results) {
          // Shuffle answers
          const formattedQuestions = data.results.map(q => {
            const answers = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
            return {
              ...q,
              answers
            };
          });
          setQuestions(formattedQuestions);
        } else {
          setError('Failed to load questions.');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to fetch quiz data.');
        setLoading(false);
      });
  }, []);

  const handleAnswer = (answer) => {
    const isCorrect = answer === questions[currentIdx].correct_answer;
    if (isCorrect) setScore(score + 1);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      finishQuiz(isCorrect ? score + 1 : score);
    }
  };

  const finishQuiz = async (finalScore) => {
    setIsFinished(true);
    setSaving(true);
    try {
      const user = auth.currentUser;
      const username = user ? (user.displayName || user.email.split('@')[0]) : 'Guest_' + Math.floor(Math.random() * 1000);
      
      await addDoc(collection(firestore, 'leaderboard'), {
        username: username,
        score: finalScore,
        total: questions.length,
        timestamp: Date.now()
      });
    } catch (err) {
      console.error("Error saving score:", err);
      // Even if it fails, they still finished
    }
    setSaving(false);
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center', fontSize: '1.2rem' }}>Loading Quiz...</div>;
  if (error) return <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>{error}</div>;

  if (isFinished) {
    return (
      <div style={{ maxWidth: '600px', margin: '50px auto', background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', color: '#1f2937', marginBottom: '10px' }}>Quiz Complete!</h2>
        <p style={{ fontSize: '1.2rem', color: '#6b7280', margin: '20px 0' }}>You scored {score} out of {questions.length}</p>
        {saving ? <p>Saving score to leaderboard...</p> : <p style={{ color: '#16a34a', fontWeight: 600 }}>Score saved to leaderboard!</p>}
        
        <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button onClick={() => window.location.reload()} style={{ padding: '12px 24px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Play Again</button>
          <Link to="/leaderboard" style={{ padding: '12px 24px', background: '#e5e7eb', color: '#1f2937', textDecoration: 'none', borderRadius: '6px', fontWeight: 600 }}>View Leaderboard</Link>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#6b7280', fontWeight: 600, fontSize: '1.1rem' }}>
        <span>Question {currentIdx + 1} of {questions.length}</span>
        <span>Score: {score}</span>
      </div>
      
      <h3 style={{ fontSize: '1.6rem', color: '#1f2937', marginBottom: '30px', lineHeight: '1.4' }} dangerouslySetInnerHTML={{ __html: currentQ.question }} />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {currentQ.answers.map((ans, idx) => (
          <button 
            key={idx}
            onClick={() => handleAnswer(ans)}
            style={{ padding: '20px', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1.1rem', color: '#334155', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.background = '#f1f5f9'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
            dangerouslySetInnerHTML={{ __html: ans }}
          />
        ))}
      </div>
    </div>
  );
};

export default Quiz;
