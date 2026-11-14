import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Award, 
  Percent, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Trash2, 
  RefreshCw, 
  Eye, 
  Download, 
  Clock, 
  ArrowLeft,
  X,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { PRE_EXAM_METADATA } from '../data/preExamQuestions';

const API_URL = import.meta.env.VITE_BACKEND_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : 'https://t-a-d.onrender.com/api');

export default function PreExamAdmin() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/pre-exam/submissions`);
      if (res.ok) {
        const data = await res.json();
        setSubmissions(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching pre-exam submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the test record for "${name}"?`);
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      const res = await fetch(`${API_URL}/pre-exam/submission/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setSubmissions(prev => prev.filter(s => s._id !== id));
        if (selectedSubmission?._id === id) {
          setSelectedSubmission(null);
        }
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeletingId(null);
    }
  };

  // Filter submissions by candidate name
  const filteredSubmissions = submissions.filter(sub => 
    (sub.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Compute aggregated stats
  const totalCandidates = submissions.length;
  const avgMarks = totalCandidates > 0 
    ? (submissions.reduce((acc, s) => acc + (s.score || 0), 0) / totalCandidates).toFixed(1)
    : 0;
  const avgPercentage = totalCandidates > 0
    ? (submissions.reduce((acc, s) => acc + (s.percentage || 0), 0) / totalCandidates).toFixed(1)
    : 0;
  const highestScore = totalCandidates > 0
    ? Math.max(...submissions.map(s => s.score || 0))
    : 0;

  // Format seconds
  const formatTime = (secs) => {
    if (!secs) return '00:00';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Export CSV
  const exportToCSV = () => {
    if (submissions.length === 0) {
      alert('No submission data to export.');
      return;
    }

    const headers = ['Candidate Name', 'Score', 'Max Score', 'Percentage', 'Correct Count', 'Wrong Count', 'Time Spent (s)', 'Submission Date'];
    const rows = submissions.map(s => [
      `"${s.name || ''}"`,
      s.score || 0,
      s.maxScore || 80,
      `${s.percentage || 0}%`,
      s.correctCount || 0,
      s.wrongCount || 0,
      s.timeSpentSeconds || 0,
      `"${new Date(s.timestamp).toLocaleString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Pre_Exam_Results_14_Nov_26_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #090e17 0%, #0d1527 50%, #111a33 100%)',
      color: '#f8fafc',
      padding: '30px 16px',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Official Assessment Banner */}
        <div style={{
          borderRadius: '18px',
          overflow: 'hidden',
          marginBottom: '24px',
          border: '1px solid rgba(59, 130, 246, 0.35)',
          boxShadow: '0 12px 35px -5px rgba(0, 0, 0, 0.6), 0 0 25px rgba(59, 130, 246, 0.15)'
        }}>
          <img
            src="/pre-exam-banner.png"
            alt="I REMEMBER TEST - Pre-exams Recommended by the Center (14-Nov-26)"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block'
            }}
          />
        </div>

        {/* Top Navbar Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          background: 'rgba(17, 24, 39, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          borderRadius: '20px',
          padding: '20px 28px',
          marginBottom: '28px',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#60a5fa',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                <ShieldCheck size={12} style={{ display: 'inline', marginRight: '4px' }} />
                Open Center Controller · No Password Needed
              </span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Pre-Exam Score & Evaluation Records
            </h1>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: '4px 0 0 0' }}>
              {PRE_EXAM_METADATA.title} · {PRE_EXAM_METADATA.subtitle}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={exportToCSV}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <FileSpreadsheet size={15} /> Export CSV
            </button>

            <button
              onClick={fetchSubmissions}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#f8fafc',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={15} className={loading ? 'spin' : ''} /> Refresh
            </button>

            <Link
              to="/test/001-haited/-Pre-exams-recommended-by-the-center/14-nov-26"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                borderRadius: '10px',
                background: '#2563eb',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              Take Exam Portal →
            </Link>
          </div>
        </div>

        {/* Aggregate KPI Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div style={{
            background: 'rgba(17, 24, 39, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>
              <Users size={16} /> Total Candidates
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#38bdf8' }}>
              {totalCandidates}
            </div>
          </div>

          <div style={{
            background: 'rgba(17, 24, 39, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>
              <Award size={16} /> Average Score
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#a855f7' }}>
              {avgMarks} <span style={{ fontSize: '16px', color: '#64748b' }}>/ 80</span>
            </div>
          </div>

          <div style={{
            background: 'rgba(17, 24, 39, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>
              <Percent size={16} /> Average Percentage
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#10b981' }}>
              {avgPercentage}%
            </div>
          </div>

          <div style={{
            background: 'rgba(17, 24, 39, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>
              <Award size={16} /> Highest Score
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#f59e0b' }}>
              {highestScore} <span style={{ fontSize: '16px', color: '#64748b' }}>/ 80</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(17, 24, 39, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '12px 18px',
          marginBottom: '20px'
        }}>
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search candidate by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '15px',
              width: '100%'
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Candidate Submissions Table */}
        <div style={{
          background: 'rgba(17, 24, 39, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)'
        }}>
          {loading ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8' }}>
              <RefreshCw size={24} className="spin" style={{ marginBottom: '12px' }} />
              <div>Loading examination records from database...</div>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8' }}>
              {searchTerm ? 'No candidate found matching your search.' : 'No candidates have submitted the exam yet.'}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <th style={{ padding: '16px 20px', fontWeight: 600, color: '#94a3b8' }}>Candidate Name</th>
                    <th style={{ padding: '16px 20px', fontWeight: 600, color: '#94a3b8' }}>Marks (80)</th>
                    <th style={{ padding: '16px 20px', fontWeight: 600, color: '#94a3b8' }}>Percentage</th>
                    <th style={{ padding: '16px 20px', fontWeight: 600, color: '#94a3b8' }}>Correct vs Wrong</th>
                    <th style={{ padding: '16px 20px', fontWeight: 600, color: '#94a3b8' }}>Time Spent</th>
                    <th style={{ padding: '16px 20px', fontWeight: 600, color: '#94a3b8' }}>Submitted At</th>
                    <th style={{ padding: '16px 20px', fontWeight: 600, color: '#94a3b8', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((sub) => {
                    const isPassing = (sub.percentage || 0) >= 50;

                    return (
                      <tr
                        key={sub._id}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          transition: 'background 0.15s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '16px 20px', fontWeight: 600, color: '#f8fafc' }}>
                          {sub.name}
                        </td>

                        <td style={{ padding: '16px 20px' }}>
                          <span style={{
                            fontWeight: 700,
                            fontSize: '15px',
                            color: isPassing ? '#38bdf8' : '#f87171'
                          }}>
                            {sub.score}
                          </span>
                          <span style={{ color: '#64748b', fontSize: '13px' }}> / {sub.maxScore || 80}</span>
                        </td>

                        <td style={{ padding: '16px 20px' }}>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '9999px',
                            fontSize: '12px',
                            fontWeight: 700,
                            background: isPassing ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: isPassing ? '#34d399' : '#f87171'
                          }}>
                            {sub.percentage}%
                          </span>
                        </td>

                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ color: '#10b981', fontWeight: 600 }}>{sub.correctCount || 0} Correct</span>
                          <span style={{ color: '#64748b' }}> · </span>
                          <span style={{ color: '#ef4444', fontWeight: 600 }}>{sub.wrongCount || 0} Wrong</span>
                        </td>

                        <td style={{ padding: '16px 20px', color: '#94a3b8' }}>
                          {formatTime(sub.timeSpentSeconds)}
                        </td>

                        <td style={{ padding: '16px 20px', color: '#94a3b8', fontSize: '13px' }}>
                          {new Date(sub.timestamp).toLocaleDateString()} {new Date(sub.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>

                        <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <button
                              onClick={() => setSelectedSubmission(sub)}
                              title="View Question-by-Question Breakdown"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                background: 'rgba(59, 130, 246, 0.15)',
                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                color: '#60a5fa',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              <Eye size={14} /> Breakdown
                            </button>

                            <button
                              onClick={() => handleDelete(sub._id, sub.name)}
                              disabled={deletingId === sub._id}
                              title="Delete Submission"
                              style={{
                                padding: '6px 8px',
                                borderRadius: '8px',
                                background: 'rgba(239, 68, 68, 0.12)',
                                border: '1px solid rgba(239, 68, 68, 0.25)',
                                color: '#f87171',
                                cursor: 'pointer'
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Breakdown Modal */}
      {selectedSubmission && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 9999
        }}>
          <div style={{
            background: '#0f172a',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '900px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(255, 255, 255, 0.02)'
            }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                  Candidate Breakdown: <span style={{ color: '#38bdf8' }}>{selectedSubmission.name}</span>
                </h2>
                <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                  Score: <strong>{selectedSubmission.score} / {selectedSubmission.maxScore || 80}</strong> ({selectedSubmission.percentage}%) · 
                  <span style={{ color: '#10b981', marginLeft: '6px' }}>{selectedSubmission.correctCount} Correct</span>, 
                  <span style={{ color: '#ef4444', marginLeft: '6px' }}>{selectedSubmission.wrongCount} Wrong</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedSubmission(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#94a3b8',
                  padding: '6px',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Questions List (Scrollable) */}
            <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {selectedSubmission.answers && selectedSubmission.answers.length > 0 ? (
                selectedSubmission.answers.map((ans, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: ans.isCorrect ? 'rgba(16, 185, 129, 0.06)' : 'rgba(239, 68, 68, 0.06)',
                      border: `1px solid ${ans.isCorrect ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
                      borderRadius: '12px',
                      padding: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>
                        Q{ans.qNum || (idx + 1)} · {ans.section || 'Assessment'}
                      </span>

                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: ans.isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: ans.isCorrect ? '#34d399' : '#f87171'
                      }}>
                        {ans.isCorrect ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                        {ans.marksAwarded} / {ans.maxMarks} Marks
                      </span>
                    </div>

                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', marginBottom: '10px' }}>
                      {ans.question}
                    </div>

                    <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
                      <span style={{ color: '#cbd5e1' }}>
                        Student Selected: <strong style={{ color: ans.isCorrect ? '#34d399' : '#f87171' }}>Option {ans.selectedOption}</strong>
                      </span>
                      {!ans.isCorrect && (
                        <span style={{ color: '#38bdf8' }}>
                          Correct Option: <strong>Option {ans.correctOption}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '30px' }}>
                  No detailed answer breakdown recorded for this submission.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'flex-end',
              background: 'rgba(255, 255, 255, 0.02)'
            }}>
              <button
                onClick={() => setSelectedSubmission(null)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
