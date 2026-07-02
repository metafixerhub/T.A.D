import React, { useState, useEffect, useRef } from 'react';
import { Video, MessageSquare, Circle, Square } from 'lucide-react';
import { ref, push, onValue } from 'firebase/database';
import { auth, database } from '../firebaseConfig'; // User needs to be logged in to chat

const LiveSession = () => {
  const jitsiContainerRef = useRef(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  // Jitsi Init
  useEffect(() => {
    const domain = 'meet.jit.si';
    const options = {
      roomName: 'MetaFixerHubLMSLiveSession',
      width: '100%',
      height: '100%',
      parentNode: jitsiContainerRef.current,
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: ['microphone', 'camera', 'desktop', 'fullscreen', 'hangup', 'chat'],
      },
    };
    
    let api = null;
    
    // Load Jitsi script
    const script = document.createElement('script');
    script.src = `https://${domain}/external_api.js`;
    script.async = true;
    script.onload = () => {
      api = new window.JitsiMeetExternalAPI(domain, options);
    };
    document.body.appendChild(script);

    return () => {
      if (api) api.dispose();
      document.body.removeChild(script);
    };
  }, []);

  // Firebase Chat Init
  useEffect(() => {
    const chatRef = ref(database, 'live_chat');
    
    const unsubscribe = onValue(chatRef, (snapshot) => {
      setErrorMsg('');
      const data = snapshot.val();
      if (data) {
        const messages = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        // Sort messages by timestamp if needed, currently just objects.
        setChatMessages(messages.sort((a,b) => a.timestamp - b.timestamp));
      } else {
        setChatMessages([]);
      }
    }, (error) => {
      console.error("Firebase Read Error:", error);
      setErrorMsg("Connection Error or Rules Denied. Check Firebase Console Rules.");
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const user = auth.currentUser;
    const chatRef = ref(database, 'live_chat');
    
    try {
      await push(chatRef, {
        text: newMessage,
        sender: user ? user.email : 'Guest',
        timestamp: Date.now()
      });
      setNewMessage('');
    } catch (err) {
      console.error("Firebase Write Error:", err);
      setErrorMsg("Cannot send message. Database rules might be blocking writes.");
    }
  };

  // Recording functionality
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      recordedChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = function(e) {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = function() {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        a.href = url;
        a.download = 'live_session_record.webm';
        a.click();
        window.URL.revokeObjectURL(url);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
      alert("Could not start screen recording. Make sure you grant permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      // Also stop the tracks to remove the recording icon from browser
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 81px)', background: '#f9fafb' }}>
      
      {/* Main Video Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ margin: 0, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Video size={24} color="#2563eb" /> Live Session
          </h2>
          
          <button 
            onClick={isRecording ? stopRecording : startRecording}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: isRecording ? '#ef4444' : '#2563eb', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
          >
            {isRecording ? <Square size={18} fill="currentColor" /> : <Circle size={18} fill="currentColor" />}
            {isRecording ? 'Stop Recording' : 'Record Screen'}
          </button>
        </div>
        
        <div 
          ref={jitsiContainerRef} 
          style={{ flex: 1, background: '#e5e7eb', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }} 
        />
      </div>

      {/* Sidebar Chat Area */}
      <div style={{ width: '350px', background: '#ffffff', borderLeft: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MessageSquare size={20} color="#2563eb" />
          <h3 style={{ margin: 0, color: '#1f2937', fontSize: '1.1rem' }}>Live Chat</h3>
        </div>
        
        {errorMsg && (
          <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px', fontSize: '0.85rem', textAlign: 'center', borderBottom: '1px solid #fee2e2', fontWeight: 500 }}>
            {errorMsg}
          </div>
        )}
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {chatMessages.map(msg => (
            <div key={msg.id} style={{ background: '#f3f4f6', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '4px', fontWeight: 600 }}>{msg.sender}</div>
              <div style={{ color: '#1f2937', fontSize: '0.95rem' }}>{msg.text}</div>
            </div>
          ))}
          {chatMessages.length === 0 && <div style={{ color: '#9ca3af', textAlign: 'center', marginTop: '20px' }}>No messages yet...</div>}
        </div>
        
        <form onSubmit={sendMessage} style={{ padding: '20px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..." 
            style={{ flex: 1, padding: '10px 15px', border: '1px solid #d1d5db', borderRadius: '20px', fontSize: '0.95rem' }}
          />
          <button type="submit" style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: 600, cursor: 'pointer' }}>
            Send
          </button>
        </form>
      </div>

    </div>
  );
};

export default LiveSession;
