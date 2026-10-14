import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, ArrowRight, CloudUpload, HardDrive, ShieldCheck, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_BACKEND_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : 'https://t-a-d.onrender.com/api');

const NotesUpload = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadedNote, setUploadedNote] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
      if (!title) {
        setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError('');
      if (!title) {
        setTitle(e.dataTransfer.files[0].name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or drop a file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadStatus('1/2 Uploading file to storage...');
    setError('');

    try {
      // 1. Upload file binary to GridFS via backend /api/upload
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
      });

      if (!uploadRes.ok) throw new Error('File upload to storage failed');
      const uploadData = await uploadRes.json();
      const filename = uploadData.file.filename;
      const fileUrl = `${API_URL}/materials/download/${filename}`;

      // 2. Post note details & sync to secondary cluster
      setUploadStatus('2/2 Syncing with primary & secondary storage cluster...');
      const noteRes = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || file.name,
          text: text,
          filename: filename,
          originalName: file.name,
          fileUrl: fileUrl,
          fileSize: file.size,
          fileType: file.type || 'application/octet-stream'
        })
      });

      if (!noteRes.ok) throw new Error('Failed to register note record');
      const createdNote = await noteRes.json();

      setUploadedNote(createdNote);
      setIsUploading(false);
      setUploadStatus('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error uploading note. Please try again.');
      setIsUploading(false);
      setUploadStatus('');
    }
  };

  const resetUpload = () => {
    setFile(null);
    setTitle('');
    setText('');
    setUploadedNote(null);
    setError('');
  };

  return (
    <div style={{ maxWidth: '850px', margin: '40px auto', padding: '0 20px', fontFamily: '"Outfit", sans-serif' }}>
      
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '30px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '8px', borderRadius: '10px' }}>
              <CloudUpload size={24} />
            </div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#f8fafc', fontWeight: 800 }}>Notes Upload Portal</h1>
          </div>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>
            Upload notes, lecture materials, and documents directly to primary and secondary cluster storage.
          </p>
        </div>
        <Link
          to="/notes/admin"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#f8fafc',
            textDecoration: 'none',
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <HardDrive size={16} color="#60a5fa" /> Notes Admin Portal <ArrowRight size={14} />
        </Link>
      </div>

      {/* Success View after Upload */}
      {uploadedNote ? (
        <div style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '20px',
          padding: '35px',
          color: '#f8fafc',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <CheckCircle size={32} color="#10b981" />
            <div>
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#34d399', fontWeight: 700 }}>Uploaded</h2>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Your file and note have been securely saved and synced.</span>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' }}>Note Title</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '15px' }}>{uploadedNote.title}</div>

            {uploadedNote.text && (
              <>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' }}>Uploaded Text / Content</div>
                <div style={{ fontSize: '0.95rem', color: '#e2e8f0', whiteSpace: 'pre-wrap', background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '8px', marginBottom: '15px', lineHeight: '1.5' }}>
                  {uploadedNote.text}
                </div>
              </>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="#60a5fa" />
                <span style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: 600 }}>{uploadedNote.originalName}</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>({(uploadedNote.fileSize / 1024).toFixed(1)} KB)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#34d399', background: 'rgba(16,185,129,0.15)', padding: '4px 10px', borderRadius: '12px' }}>
                <ShieldCheck size={14} /> Synced to Secondary Cluster 1
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <button
              onClick={resetUpload}
              style={{
                flex: 1,
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              Upload Another Note
            </button>
            <Link
              to="/notes/admin"
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.1)',
                color: '#f8fafc',
                textDecoration: 'none',
                padding: '12px 20px',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.95rem',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              Go to Notes Admin <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      ) : (
        /* Upload Form */
        <form onSubmit={handleSubmit} style={{
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>

          {/* Direct File Upload Area */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', color: '#f8fafc', fontWeight: 600, marginBottom: '8px', fontSize: '1rem' }}>
              Select File to Upload <span style={{ color: '#ef4444' }}>*</span>
            </label>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: file ? '2px solid #3b82f6' : '2px dashed rgba(255, 255, 255, 0.2)',
                background: file ? 'rgba(59, 130, 246, 0.08)' : 'rgba(0, 0, 0, 0.2)',
                borderRadius: '14px',
                padding: '40px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {file ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                  <div style={{ background: '#3b82f6', color: 'white', padding: '12px', borderRadius: '10px' }}>
                    <FileText size={28} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '1rem' }}>{file.name}</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{(file.size / 1024).toFixed(1)} KB • Click to change file</div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', marginLeft: '10px' }}
                    title="Remove file"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload size={40} color="#60a5fa" style={{ margin: '0 auto 12px auto' }} />
                  <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '1.05rem', marginBottom: '4px' }}>
                    Click to browse or drag and drop your file here
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                    Supports PDF, Word Documents, Code files, Images, Text & ZIP archives
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Note Title Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#f8fafc', fontWeight: 600, marginBottom: '8px', fontSize: '0.95rem' }}>
              Note Title / Subject
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 4 - Full Stack Architecture Notes"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Text Box for Description / Content */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', color: '#f8fafc', fontWeight: 600, marginBottom: '8px', fontSize: '0.95rem' }}>
              Note Content / Description (Text Box)
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Write or paste your note summary, explanation, or key takeaways here..."
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '0.95rem',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          {error && (
            <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px 15px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              background: isUploading ? '#64748b' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              border: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
            }}
          >
            {isUploading ? (
              <span>{uploadStatus || 'Uploading...'}</span>
            ) : (
              <>
                <CloudUpload size={20} /> Upload Note & Push to Cluster
              </>
            )}
          </button>
        </form>
      )}

    </div>
  );
};

export default NotesUpload;
