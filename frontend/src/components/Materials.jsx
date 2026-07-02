import React, { useState, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { storage, firestore } from '../firebaseConfig';
import { FileText, Upload, DownloadCloud, Settings, Lock } from 'lucide-react';

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Teacher Upload State
  const [isTeacherUnlocked, setIsTeacherUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const q = query(collection(firestore, 'materials'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetched = [];
      querySnapshot.forEach((doc) => fetched.push({ id: doc.id, ...doc.data() }));
      setMaterials(fetched);
    } catch (err) {
      console.error(err);
      if (err.message.includes('index')) {
        setError('Firestore Index required. Check console for link.');
      } else {
        setError('Failed to fetch materials. Make sure Firestore rules allow reading.');
      }
    }
    setLoading(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) return alert('Please select a file and enter a title.');

    setUploading(true);
    const storageRef = ref(storage, `materials/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error(error);
        alert('Upload failed: ' + error.message);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        
        await addDoc(collection(firestore, 'materials'), {
          title,
          fileName: file.name,
          url: downloadURL,
          size: file.size,
          timestamp: Date.now()
        });

        alert('Material uploaded successfully!');
        setFile(null);
        setTitle('');
        setUploadProgress(0);
        setUploading(false);
        fetchMaterials(); // refresh list
      }
    );
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '50px auto', padding: '0 20px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
        <FileText size={40} color="#2563eb" />
        <h2 style={{ fontSize: '2.5rem', color: '#1f2937', margin: 0 }}>Course Materials</h2>
      </div>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        {/* Left Col: Materials List */}
        <div style={{ flex: 2, minWidth: '300px' }}>
          {loading ? <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>Loading materials...</p> : error ? <p style={{ color: 'red', fontWeight: 600 }}>{error}</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {materials.length === 0 ? (
                <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>No materials have been uploaded yet.</p>
              ) : materials.map(mat => (
                <div key={mat.id} style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', color: '#1f2937', fontSize: '1.2rem' }}>{mat.title}</h3>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.85rem' }}>{mat.fileName} • {(mat.size / 1024 / 1024).toFixed(2)} MB • {new Date(mat.timestamp).toLocaleDateString()}</p>
                  </div>
                  <a href={mat.url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f3f4f6', color: '#2563eb', textDecoration: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, transition: 'background 0.2s' }}
                     onMouseOver={e => e.currentTarget.style.background = '#e5e7eb'}
                     onMouseOut={e => e.currentTarget.style.background = '#f3f4f6'}
                  >
                    <DownloadCloud size={18} /> Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Teacher Upload */}
        <div style={{ flex: 1, minWidth: '300px', background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '15px' }}>
            <Settings size={20} color="#64748b" />
            <h3 style={{ margin: 0, color: '#334155' }}>Teacher Upload</h3>
          </div>

          {!isTeacherUnlocked ? (
            <form onSubmit={(e) => { e.preventDefault(); if (passcode === 'nur1438nur') setIsTeacherUnlocked(true); else alert('Wrong passcode'); }}>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '15px' }}>Enter passcode to upload materials.</p>
              <input type="password" placeholder="Passcode" value={passcode} onChange={e=>setPasscode(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <button type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                <Lock size={16} /> Unlock
              </button>
            </form>
          ) : (
            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '0.9rem', color: '#64748b', display: 'block', marginBottom: '5px', fontWeight: 500 }}>Material Title</label>
                <input type="text" placeholder="e.g. Chapter 1 PDF" value={title} onChange={e=>setTitle(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} required />
              </div>
              <div>
                <label style={{ fontSize: '0.9rem', color: '#64748b', display: 'block', marginBottom: '5px', fontWeight: 500 }}>Select File</label>
                <input type="file" onChange={e=>setFile(e.target.files[0])} style={{ width: '100%', padding: '10px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #cbd5e1' }} required />
              </div>

              {uploading && (
                <div style={{ width: '100%', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${uploadProgress}%`, background: '#22c55e', height: '6px', transition: 'width 0.2s' }}></div>
                </div>
              )}

              <button type="submit" disabled={uploading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '12px', background: uploading ? '#94a3b8' : '#22c55e', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: uploading ? 'default' : 'pointer', transition: 'background 0.2s' }}>
                <Upload size={18} /> {uploading ? `Uploading ${Math.round(uploadProgress)}%` : 'Upload Material'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default Materials;
