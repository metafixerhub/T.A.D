import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';
import { PlayCircle, Video, Clock, X, CheckCircle2 } from 'lucide-react';
import YouTube from 'react-youtube';

// Helper function to extract YouTube ID
const getYouTubeID = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const Recordings = () => {
  const [recordings, setRecordings] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null); // stores the currently playing video id
  const [userProgress, setUserProgress] = useState({});
  const playerRef = React.useRef(null);
  const progressIntervalRef = React.useRef(null);

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

    if (auth.currentUser) {
      const progRef = ref(database, `video_progress/${auth.currentUser.uid}`);
      const unsubProg = onValue(progRef, (snapshot) => {
        if (snapshot.val()) {
          setUserProgress(snapshot.val());
        }
      });
      return () => { unsub(); unsubProg(); };
    }
    
    return () => unsub();
  }, []);

  const handlePlayerReady = (event) => {
    playerRef.current = event.target;
  };

  const handleStateChange = (event) => {
    // Playing (1)
    if (event.data === 1) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = setInterval(saveProgress, 5000);
    } else {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      saveProgress();
    }
  };

  const saveProgress = async () => {
    if (!playerRef.current || !activeVideo || !auth.currentUser) return;
    try {
      const current = playerRef.current.getCurrentTime();
      const duration = playerRef.current.getDuration();
      if (duration > 0) {
        let pct = Math.floor((current / duration) * 100);
        if (pct > 100) pct = 100;
        
        // Prevent lowering progress if they rewind
        const existingPct = userProgress[activeVideo.id]?.percent || 0;
        if (pct >= existingPct || pct > 95) { // If > 95, count as 100
          if (pct > 95) pct = 100;
          
          import('firebase/database').then(({ set, ref }) => {
            set(ref(database, `video_progress/${auth.currentUser.uid}/${activeVideo.id}`), {
              percent: pct,
              lastUpdated: Date.now(),
              videoTitle: activeVideo.title
            });
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const closePlayer = () => {
    saveProgress();
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setActiveVideo(null);
  };

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

            return (
              <div key={rec.id} style={{ 
                background: 'rgba(30, 41, 59, 0.5)', 
                borderRadius: '16px', 
                overflow: 'hidden', 
                border: '1px solid rgba(255,255,255,0.05)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                transition: 'transform 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                position: 'relative'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              onClick={() => {
                if (!videoId) {
                  window.open(rec.url, '_blank');
                } else {
                  setActiveVideo({ ...rec, videoId });
                }
              }}
              >
                {/* Progress Bar Badge */}
                {userProgress[rec.id] && (
                  <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10, background: userProgress[rec.id].percent === 100 ? '#10b981' : '#f59e0b', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                    {userProgress[rec.id].percent === 100 ? <CheckCircle2 size={12} /> : null}
                    {userProgress[rec.id].percent}% Watched
                  </div>
                )}
                
                {/* Video Area */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: 'black' }}>
                  <img src={thumbnail} alt={rec.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                  <div 
                    style={{ 
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(0,0,0,0.3)'
                    }}
                    className="play-button-overlay"
                  >
                    <PlayCircle size={60} color="white" strokeWidth={1.5} style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }} />
                  </div>
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

      {/* Fullscreen Video Modal */}
      {activeVideo && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.95)', zIndex: 99999, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)'
        }}>
          {/* Header/Close bar */}
          <div style={{ position: 'absolute', top: '20px', right: '30px', left: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: 'white', margin: 0, fontSize: '1.2rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '80%' }}>{activeVideo.title}</h2>
            <button 
              onClick={closePlayer}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.8)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Iframe Container */}
          <div style={{ width: '90%', maxWidth: '1400px', aspectRatio: '16/9', background: 'black', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <YouTube 
              videoId={activeVideo.videoId} 
              opts={{ width: '100%', height: '100%', playerVars: { autoplay: 1, rel: 0, modestbranding: 1 } }} 
              onReady={handlePlayerReady} 
              onStateChange={handleStateChange}
              style={{ width: '100%', height: '100%' }}
              iframeClassName="youtube-iframe-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Recordings;
