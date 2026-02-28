import React from 'react';
import '../styles/components.css';

function SignalTags({ signals }) {
  return (
    <section className="dashboard-section signals-section">
      <h2 className="section-title">Key Signals</h2>
      <div className="signals-grid">
        {signals.map((signal, index) => (
          <div key={index} className="signal-tag">
            <span className="signal-icon">✨</span>
            <span className="signal-text">{signal}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SignalTags;
