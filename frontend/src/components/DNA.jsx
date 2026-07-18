import React, { useState, useEffect } from 'react';
import { ref, onValue, push } from 'firebase/database';
import { database, auth } from '../firebaseConfig';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';

const DNA = () => {
  const [dnas, setDnas] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedDna, setSelectedDna] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const dnasRef = ref(database, 'dna_assessments');
    const unsubDnas = onValue(dnasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setDnas(list.sort((a, b) => b.timestamp - a.timestamp));
      } else {
        setDnas([]);
      }
    });

    const subsRef = ref(database, 'dna_submissions');
    const unsubSubs = onValue(subsRef, (snapshot) => {
      const data = snapshot.val();
      if (data && auth.currentUser) {
        const list = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .filter(s => s.userId === auth.currentUser.uid);
        setSubmissions(list);
      } else {
        setSubmissions([]);
      }
    });

    return () => { unsubDnas(); unsubSubs(); };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;
    
    setIsSubmitting(true);
    try {
      await push(ref(database, 'dna_submissions'), {
        dnaId: selectedDna.id,
        chapter: selectedDna.chapter,
        xp: selectedDna.xp,
        answerText: answerText,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        approved: false,
        timestamp: Date.now()
      });
      alert('Your answers have been submitted for review!');
      setAnswerText('');
      setSelectedDna(null);
    } catch (err) {
      console.error(err);
      alert('Failed to submit answers.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatus = (dnaId) => {
    const sub = submissions.find(s => s.dnaId === dnaId);
    if (!sub) return null;
    return sub.approved ? 'completed' : 'pending';
  };

  if (selectedDna) {
    const status = getStatus(selectedDna.id);
    return (
      <div style={{ maxWidth: '900px', margin: '40px auto', background: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
        <button onClick={() => setSelectedDna(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', marginBottom: '20px', fontSize: '1rem' }}>← Back to DNA List</button>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '2rem', color: '#10b981', margin: 0 }}>{selectedDna.chapter}</h2>
          <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '5px 15px', borderRadius: '20px', fontWeight: 600 }}>{selectedDna.xp} XP</span>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '25px', borderRadius: '12px', marginBottom: '30px', whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '1.05rem', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.05)' }}>
          {selectedDna.questions}
        </div>

        {status === 'completed' ? (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '30px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <CheckCircle size={50} color="#10b981" style={{ marginBottom: '15px' }} />
            <h3 style={{ color: '#10b981', margin: '0 0 10px 0' }}>Chapter Completed!</h3>
            <p style={{ color: '#94a3b8', margin: 0 }}>You earned {selectedDna.xp} XP for this assessment.</p>
            <div style={{ marginTop: '20px', textAlign: 'left', background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '8px', whiteSpace: 'pre-wrap', color: '#e2e8f0' }}>
              <h4 style={{ color: '#10b981', marginTop: 0 }}>Answer Key:</h4>
              {selectedDna.answers}
            </div>
          </div>
        ) : status === 'pending' ? (
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '30px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <Clock size={50} color="#f59e0b" style={{ marginBottom: '15px' }} />
            <h3 style={{ color: '#f59e0b', margin: '0 0 10px 0' }}>Pending Review</h3>
            <p style={{ color: '#94a3b8', margin: 0 }}>Your answers have been submitted. The admin will review them shortly to award your XP.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 style={{ color: '#f8fafc', marginBottom: '15px' }}>Your Answers:</h3>
            <textarea 
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Type your complete answers here..."
              required
              style={{ width: '100%', minHeight: '300px', padding: '20px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', lineHeight: '1.5', marginBottom: '20px', fontFamily: 'inherit' }}
            />
            <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '15px', background: isSubmitting ? '#94a3b8' : '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
              {isSubmitting ? 'Submitting...' : 'Submit Answers & Request Review'}
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', color: 'white' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
        <BookOpen size={40} color="#10b981" />
        <div>
          <h1 style={{ margin: 0, fontSize: '2.5rem', color: '#f8fafc' }}>DNA Assessments</h1>
          <p style={{ margin: '5px 0 0 0', color: '#94a3b8', fontSize: '1.1rem' }}>Complete your Daily Notes & Assessments to earn massive XP.</p>
        </div>
      </div>

      {dnas.length === 0 ? (
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '50px', textAlign: 'center', borderRadius: '16px', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }}>
          No DNA chapters have been published yet. Check back later!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
          {dnas.map(dna => {
            const status = getStatus(dna.id);
            return (
              <div key={dna.id} onClick={() => setSelectedDna(dna)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '25px', cursor: 'pointer', transition: 'transform 0.2s, background 0.2s', position: 'relative', overflow: 'hidden' }} onMouseOver={e => {e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}} onMouseOut={e => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.3rem', flex: 1 }}>{dna.chapter}</h3>
                  <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, marginLeft: '10px' }}>{dna.xp} XP</span>
                </div>
                
                {status === 'completed' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 600, marginTop: '20px' }}><CheckCircle size={18} /> Completed</div>
                ) : status === 'pending' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontWeight: 600, marginTop: '20px' }}><Clock size={18} /> Pending Review</div>
                ) : (
                  <div style={{ color: '#3b82f6', fontWeight: 600, marginTop: '20px' }}>Click to Start →</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DNA;
