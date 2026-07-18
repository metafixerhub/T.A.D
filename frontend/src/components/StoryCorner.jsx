import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, MessageCircle, Heart, Share2, FileText, Download } from 'lucide-react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';

const StoryCorner = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const storyRef = ref(database, 'story_corner');
    const unsub = onValue(storyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arr = Object.keys(data).map(k => ({ id: k, ...data[k] }));
        setStories(arr.sort((a,b) => b.timestamp - a.timestamp));
      } else {
        setStories([]);
      }
    });
    return () => unsub();
  }, []);

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto', fontFamily: '"Outfit", sans-serif' }}>
      
      <div style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', padding: '40px', borderRadius: '24px', color: 'white', marginBottom: '40px', boxShadow: '0 10px 30px rgba(59,130,246,0.3)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem', fontWeight: 800 }}>Story Corner</h1>
          <p style={{ margin: 0, fontSize: '1.1rem', opacity: 0.9 }}>Discover the latest updates, announcements, and visual stories from the EduVerse team.</p>
        </div>
        <ImageIcon size={150} color="rgba(255,255,255,0.1)" style={{ position: 'absolute', right: '-20px', bottom: '-40px', transform: 'rotate(-15deg)' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {stories.map(story => (
          <div key={story.id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            
            {/* Header */}
            <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '45px', height: '45px', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                {story.author?.charAt(0) || 'A'}
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem' }}>{story.author || 'Admin'}</h3>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{new Date(story.timestamp).toLocaleString()}</span>
              </div>
            </div>

            {/* Text Content */}
            {story.text && (
              <div style={{ padding: '0 20px 20px 20px', color: '#475569', fontSize: '1.05rem', lineHeight: 1.6 }}>
                {story.text}
              </div>
            )}

            {/* PDF Document Link */}
            {story.pdfUrl && (
              <div style={{ padding: '0 20px 20px 20px' }}>
                <a href={story.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '15px 20px', borderRadius: '12px', textDecoration: 'none', color: '#1e293b', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#f1f5f9'} onMouseOut={e=>e.currentTarget.style.background='#f8fafc'}>
                  <div style={{ background: '#ef4444', padding: '10px', borderRadius: '8px', color: 'white' }}>
                    <FileText size={24} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>Attached Document (PDF)</div>
                    <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Click to view or download</div>
                  </div>
                  <Download color="#94a3b8" size={20} />
                </a>
              </div>
            )}

            {/* Image */}
            {story.imageUrl && (
              <div style={{ width: '100%', maxHeight: '500px', overflow: 'hidden', background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
                <img src={story.imageUrl} alt="Story" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e=>e.target.style.display='none'} />
              </div>
            )}

            {/* Action Bar */}
            <div style={{ padding: '15px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '20px' }}>
              <button style={{ background: 'none', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}>
                <Heart size={20} /> Like
              </button>
              <button style={{ background: 'none', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}>
                <MessageCircle size={20} /> Comment
              </button>
              <button style={{ background: 'none', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', marginLeft: 'auto' }}>
                <Share2 size={20} /> Share
              </button>
            </div>

          </div>
        ))}

        {stories.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
            <ImageIcon size={40} color="#cbd5e1" style={{ margin: '0 auto 15px auto' }} />
            <h3 style={{ color: '#64748b', margin: 0 }}>No stories published yet.</h3>
          </div>
        )}
      </div>

    </div>
  );
};

export default StoryCorner;
