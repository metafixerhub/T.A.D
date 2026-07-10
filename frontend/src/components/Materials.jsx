import React, { useState, useEffect } from 'react';
import { FileText, Upload, DownloadCloud, Settings, Lock } from 'lucide-react';

// Automatically switch between local backend and Render backend
const API_URL = import.meta.env.VITE_BACKEND_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : 'https://t-a-d.onrender.com/api');

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Teacher Upload State
  const [isTeacherUnlocked, setIsTeacherUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/materials`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setMaterials(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch materials from the server. Make sure the Node.js backend is running.');
    }
    setLoading(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) return alert('Please select a file and enter a title.');

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error("Upload failed");
      
      alert('Material uploaded successfully!');
      setFile(null);
      setTitle('');
      fetchMaterials(); // refresh list
    } catch (err) {
      console.error(err);
      alert('Upload failed: ' + err.message);
    }
    setUploading(false);
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
                <div key={mat._id} style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', color: '#1f2937', fontSize: '1.2rem' }}>{mat.metadata?.title || mat.filename}</h3>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.85rem' }}>{mat.metadata?.originalName || mat.filename} • {(mat.length / 1024 / 1024).toFixed(2)} MB • {new Date(mat.metadata?.timestamp || Date.now()).toLocaleDateString()}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <a href={`${API_URL}/materials/download/${mat.filename}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#eef2ff', color: '#4f46e5', textDecoration: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 600, transition: 'background 0.2s' }}
                       onMouseOver={e => e.currentTarget.style.background = '#e0e7ff'}
                       onMouseOut={e => e.currentTarget.style.background = '#eef2ff'}
                    >
                      <FileText size={18} /> Open
                    </a>
                    <a href={`${API_URL}/materials/download/${mat.filename}?download=true`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f3f4f6', color: '#2563eb', textDecoration: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 600, transition: 'background 0.2s' }}
                       onMouseOver={e => e.currentTarget.style.background = '#e5e7eb'}
                       onMouseOut={e => e.currentTarget.style.background = '#f3f4f6'}
                       download
                    >
                      <DownloadCloud size={18} /> Download
                    </a>
                  </div>
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

              <button type="submit" disabled={uploading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '12px', background: uploading ? '#94a3b8' : '#22c55e', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: uploading ? 'default' : 'pointer', transition: 'background 0.2s' }}>
                <Upload size={18} /> {uploading ? `Uploading to MongoDB...` : 'Upload Material'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default Materials;
