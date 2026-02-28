import React, { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/landing.css';

const WHATSAPP_STEPS = [
  { platform: 'iOS', steps: ['Open the chat', 'Tap the contact name at the top', 'Scroll down → Export Chat', 'Choose Without Media', 'Save or share the .txt file'] },
  { platform: 'Android', steps: ['Open the chat', 'Tap ⋮ (three dots) → More → Export Chat', 'Choose Without Media', 'Save or share the .txt file'] },
];

function Landing({ onDataLoaded }) {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [guideOpen, setGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('iOS');
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [user, setUser] = useState('');

  const sendToBackend = async (file) => {
    setStatus('loading');
    setErrorMsg('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user', user || 'Mannan');

    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || `Server error: ${response.status}`);
      }

      const data = await response.json();
      onDataLoaded(data);
      navigate('/dashboard');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.name.match(/\.(txt)$/i)) {
      setStatus('error');
      setErrorMsg('Please upload a plain text file (.txt).');
      return;
    }
    setFileName(file.name);
    sendToBackend(file);
  };

  const handleFileChange = (e) => handleFile(e.target.files[0]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, [user]);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  return (
    <div className="landing-root">
      <div className="landing-grid-overlay" />

      <div className="landing-wrapper">
        <header className="landing-header">
          <div className="landing-wordmark">
            <span className="wordmark-accent">Aff</span>
            <span className="wordmark-base">inity</span>
          </div>
          <p className="landing-tagline">Relationship intelligence, distilled.</p>
        </header>

        <main className="landing-card">
          <div className="landing-card-inner">
            <h1 className="landing-headline">Understand your connections.</h1>
            <p className="landing-subheadline">
              Upload a conversation export and get a structured analysis of communication
              patterns, relationship health, and actionable insights.
            </p>

            {/* WhatsApp Export Guide */}
            <div className="export-guide">
              <button className="guide-toggle" onClick={() => setGuideOpen(o => !o)}>
                <span className="guide-toggle-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 7, flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  How to export your WhatsApp chat
                </span>
                <svg className={`guide-chevron${guideOpen ? ' guide-chevron--open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {guideOpen && (
                <div className="guide-body">
                  <div className="guide-tabs">
                    {WHATSAPP_STEPS.map(({ platform }) => (
                      <button
                        key={platform}
                        className={`guide-tab${activeTab === platform ? ' guide-tab--active' : ''}`}
                        onClick={() => setActiveTab(platform)}
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                  <ol className="guide-steps">
                    {WHATSAPP_STEPS.find(p => p.platform === activeTab).steps.map((step, i) => (
                      <li key={i} className="guide-step">
                        <span className="guide-step-num">{i + 1}</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            <p style={{ fontSize: '0.7rem', backgroundColor: 'rgba(204, 255, 0, 0.4)', padding: '5px 10px', borderRadius: '10px', width: '50%', marginTop: '0', marginBottom: '20px' }}>
              Note: Only 500 latest chats will be analyzed
            </p>

            {/* Name input */}
            <div className="name-input-wrap">
              <svg className="name-input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                className="name-input"
                placeholder="Your name"
                value={user}
                onChange={e => setUser(e.target.value)}
              />
            </div>

            {/* Drop zone */}
            <div
              className={`dropzone${isDragging ? ' dropzone--active' : ''}${status === 'error' ? ' dropzone--error' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => status !== 'loading' && fileInputRef.current.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              {status === 'loading' ? (
                <div className="dropzone-loading">
                  <div className="spinner" />
                  <p className="loading-text">Analyzing <em>{fileName}</em>&hellip;</p>
                  <p className="loading-subtext">This may take a few seconds.</p>
                </div>
              ) : (
                <div className="dropzone-prompt">
                  <svg className="upload-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <p className="upload-label">
                    Drop your file here, or <span className="upload-link">browse</span>
                  </p>
                  <p className="upload-hint">Accepts .txt</p>
                </div>
              )}
            </div>

            {status === 'error' && (
              <p className="error-text">{errorMsg}</p>
            )}

            <div className="features">
              {[
                { label: 'Relationship Health', desc: 'Sentiment trends and engagement balance' },
                { label: 'Memory Insights', desc: 'Recurring topics, goals, and shared interests' },
                { label: 'Behavioural Patterns', desc: 'Response cadence, conversation initiators' },
                { label: 'Smart Suggestions', desc: 'Personalised engagement recommendations' },
              ].map((f) => (
                <div key={f.label} className="feature-row">
                  <span className="feature-dot" />
                  <div>
                    <span className="feature-label">{f.label}</span>
                    <span className="feature-desc"> — {f.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        <footer className="landing-footer">
          No data is stored &nbsp;&middot;&nbsp; Processed locally &nbsp;&middot;&nbsp; Complete privacy
        </footer>
      </div>
    </div>
  );
}

export default Landing;