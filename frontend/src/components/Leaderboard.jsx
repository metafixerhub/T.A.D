import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import { Trophy } from 'lucide-react';

const Leaderboard = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const q = query(collection(firestore, 'users'), orderBy('xp', 'desc'), limit(50));
        const querySnapshot = await getDocs(q);
        
        const fetchedScores = [];
        querySnapshot.forEach((doc) => {
          fetchedScores.push({ id: doc.id, ...doc.data() });
        });
        
        setScores(fetchedScores);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        if (err.message.includes('index')) {
          setError("Firestore Index required. Check the console for the index creation link.");
        } else {
          setError("Failed to load leaderboard. Make sure Firestore rules allow reading.");
        }
      }
      setLoading(false);
    };
    
    fetchScores();
  }, []);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center', fontSize: '1.2rem' }}>Loading Leaderboard...</div>;
  if (error) return <div style={{ padding: '50px', textAlign: 'center', color: 'red', fontWeight: 600 }}>{error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '40px' }}>
        <Trophy size={40} color="#eab308" />
        <h2 style={{ fontSize: '2.5rem', color: '#1f2937', margin: 0 }}>XP Leaderboard</h2>
      </div>

      {scores.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '1.1rem' }}>No users have earned XP yet. Jump into a live session to earn some!</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
              <th style={{ padding: '15px 10px', color: '#6b7280' }}>Rank</th>
              <th style={{ padding: '15px 10px', color: '#6b7280' }}>Student</th>
              <th style={{ padding: '15px 10px', color: '#6b7280' }}>Total XP</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((entry, idx) => (
              <tr key={entry.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '15px 10px', fontWeight: 600, color: idx < 3 ? '#eab308' : '#6b7280', fontSize: '1.1rem' }}>#{idx + 1}</td>
                <td style={{ padding: '15px 10px', fontWeight: 500, color: '#1f2937' }}>{entry.username || entry.email}</td>
                <td style={{ padding: '15px 10px', fontWeight: 600, color: '#2563eb' }}>{entry.xp} XP</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;
