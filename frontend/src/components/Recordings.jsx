import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';
import { PlayCircle, Video, Clock } from 'lucide-react';

// Helper function to extract YouTube ID
const getYouTubeID = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const Recordings = () => {
  const [recordings, setRecordings] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null); // stores the currently playing video id

  useEffect(() => {
    const recRef = ref(database, 'recordings');
    const unsub = onValue(recRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const recs = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setRecordings(recs.sort((a, b) => b.timestamp - a.timestamp));
      } else {
        setRecordings([]);
      }
    });
    return () => unsub();
  }, []);

  return (
    <div style={{ padding: '30px', color: 'white', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <h1 style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', color: '#f8fafc', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
        <Video color="#3b82f6" size={32} /> Class Recordings
      </h1>
      
      <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '40px' }}>
        Catch up on missed live sessions. Click on any recording below to watch it directly.
      </p>

      {recordings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Video size={48} color="#475569" style={{ marginBottom: '15px' }} />
          <h3 style={{ color: '#94a3b8' }}>No recordings available yet.</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
          {recordings.map(rec => {
            const videoId = getYouTubeID(rec.url);
            const defaultThumb = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '/logo.png';
            const thumbnail = rec.thumbUrl || defaultThumb;
            const isPlaying = activeVideo === rec.id;

            return (
              <div key={rec.id} style={{ 
                background: 'rgba(30, 41, 59, 0.5)', 
                borderRadius: '16px', 
                overflow: 'hidden', 
                border: '1px solid rgba(255,255,255,0.05)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                transition: 'transform 0.3s ease',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseOver={e => !isPlaying && (e.currentTarget.style.transform = 'translateY(-5px)')}
              onMouseOut={e => !isPlaying && (e.currentTarget.style.transform = 'translateY(0)')}
              >
                {/* Video Area */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: 'black' }}>
                  {isPlaying && videoId ? (
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} 
                      title={rec.title}
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                      style={{ border: 'none' }}
                    ></iframe>
                  ) : (
                    <>
                      <img src={thumbnail} alt={rec.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                      <div 
                        onClick={() => {
                          if (!videoId) {
                            window.open(rec.url, '_blank');
                          } else {
                            setActiveVideo(rec.id);
                          }
                        }}
                        style={{ 
                          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', background: 'rgba(0,0,0,0.3)'
                        }}
                        className="play-button-overlay"
                      >
                        <PlayCircle size={60} color="white" strokeWidth={1.5} style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }} />
                      </div>
                    </>
                  )}
                </div>

                {/* Details Area */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: 'white', lineHeight: '1.4' }}>{rec.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '0.85rem' }}>
                    <Clock size={14} /> <span>{new Date(rec.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Recordings;
