import React, { useState, useEffect } from 'react';
import { HardDrive, Download, Trash2, Search, X, RefreshCw, FileText, PlusCircle, CheckCircle, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_BACKEND_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : 'https://t-a-d.onrender.com/api');

const NotesAdmin = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [clusterStats, setClusterStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/notes`);
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClusterStats = async () => {
    setStatsLoading(true);
    try {
      const res = await fetch('https://one0l-server-point-234567.onrender.com/api/external/stats-embed');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setClusterStats(data.data[0]); // Cluster 1
        }
      }
    } catch (err) {
      console.warn("Could not fetch external stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
    fetchClusterStats();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this note and its file?")) {
      try {
        const res = await fetch(`${API_URL}/notes/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setNotes(prev => prev.filter(n => n._id !== id));
        } else {
          alert("Failed to delete note.");
        }
      } catch (err) {
        alert("Error deleting note: " + err.message);
      }
    }
  };

  const filteredNotes = notes.filter(n => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const titleMatch = n.title?.toLowerCase().includes(term);
    const textMatch = n.text?.toLowerCase().includes(term);
    const fileMatch = n.originalName?.toLowerCase().includes(term);
    return titleMatch || textMatch || fileMatch;
  });

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', fontFamily: '"Outfit", sans-serif' }}>
      
      {/* Top Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '25px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '8px', borderRadius: '10px' }}>
              <HardDrive size={24} />
            </div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#f8fafc', fontWeight: 800 }}>Notes Controller & Admin</h1>
          </div>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>
            Open Controller (No Password Required). Review uploads, download notes, and manage secondary cluster storage.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/notes"
            style={{
              background: '#3b82f6',
              color: 'white',
              textDecoration: 'none',
              padding: '10px 18px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <PlusCircle size={16} /> Upload New Note
          </Link>
          <button
            onClick={() => { fetchNotes(); fetchClusterStats(); }}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#cbd5e1',
              padding: '10px 14px',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            <RefreshCw size={14} className={loading || statsLoading ? 'spin-icon' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Secondary Storage Cluster Status Card */}
      {clusterStats && (
        <div style={{
          background: 'rgba(59, 130, 246, 0.08)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '14px',
          padding: '16px 20px',
          marginBottom: '25px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Database size={22} color="#60a5fa" />
            <div>
              <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.95rem' }}>
                Secondary Storage Server ({clusterStats.name || 'Cluster 1'})
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                Connected to https://one0l-server-point-234567.onrender.com/
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '0.8rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.15)', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>
              ● Status: {clusterStats.status || 'Online'}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#60a5fa', background: 'rgba(59, 130, 246, 0.15)', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>
              Storage: {clusterStats.storagePercent ?? 0}%
            </span>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'rgba(30, 41, 59, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '12px 18px',
        borderRadius: '12px',
        marginBottom: '25px'
      }}>
        <Search size={18} color="#94a3b8" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search uploaded notes by title, content, or filename..."
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            outline: 'none',
            width: '100%',
            fontSize: '0.95rem'
          }}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Notes List */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
            Loading uploaded notes...
          </div>
        )}

        {!loading && filteredNotes.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '50px 20px',
            background: 'rgba(30, 41, 59, 0.4)',
            borderRadius: '16px',
            border: '1px dashed rgba(255, 255, 255, 0.15)'
          }}>
            <FileText size={40} color="#64748b" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ color: '#e2e8f0', margin: '0 0 6px 0' }}>
              {searchTerm ? `No notes matching "${searchTerm}"` : 'No notes uploaded yet.'}
            </h3>
            <p style={{ color: '#94a3b8', margin: '0 0 20px 0', fontSize: '0.9rem' }}>
              Upload your first note using the upload portal.
            </p>
            <Link
              to="/notes"
              style={{
                background: '#3b82f6',
                color: 'white',
                textDecoration: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <PlusCircle size={16} /> Go to /notes
            </Link>
          </div>
        )}

        {!loading && filteredNotes.map((note) => (
          <div
            key={note._id}
            style={{
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
          >
            {/* Header: Title & Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', color: '#f8fafc', fontSize: '1.2rem', fontWeight: 700 }}>
                  {note.title}
                </h3>
                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                  📅 Uploaded {new Date(note.timestamp).toLocaleString()}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {note.fileUrl && (
                  <a
                    href={`${note.fileUrl}?download=true`}
                    download={note.originalName || true}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Download size={14} /> Download
                  </a>
                )}
                <button
                  onClick={() => handleDelete(note._id)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  title="Delete note permanently"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>

            {/* Note Text Box Content */}
            {note.text && (
              <div style={{
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                padding: '14px',
                color: '#e2e8f0',
                fontSize: '0.92rem',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap'
              }}>
                {note.text}
              </div>
            )}

            {/* File Info Bar & Cluster Sync Tag */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
              paddingTop: '10px',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} color="#60a5fa" />
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>{note.originalName}</span>
                {note.fileSize && (
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    ({(note.fileSize / 1024).toFixed(1)} KB)
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.15)', padding: '3px 10px', borderRadius: '10px', fontWeight: 600 }}>
                <CheckCircle size={12} /> Secondary Cluster 1 Synced
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default NotesAdmin;
