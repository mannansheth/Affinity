import React, { useState } from 'react';
import '../styles/components.css';

function ReminderSection({ reminders }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high':
        return 'urgency-high';
      case 'medium':
        return 'urgency-medium';
      case 'low':
        return 'urgency-low';
      default:
        return 'urgency-medium';
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '🟡';
    }
  };

  const handleCopyMessage = (message, index) => {
    navigator.clipboard.writeText(message).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  return (
    <section className="dashboard-section reminder-section">
      <h2 className="section-title">Reminders</h2>
      <div className="reminders-container">
        {reminders.map((reminder, index) => (
          <div key={index} className="reminder-card">
            <div className="reminder-header">
              <div className="reminder-title-group">
                <h3 className="reminder-title">{reminder.topic}</h3>
                <div className={`urgency-badge ${getUrgencyColor(reminder.urgency)}`}>
                  <span className="urgency-icon">{getUrgencyIcon(reminder.urgency)}</span>
                  <span className="urgency-label">{reminder.urgency}</span>
                </div>
              </div>
            </div>

            <div className="reminder-message-section">
              <p className="message-label">Suggested Message:</p>
              <div className="message-bubble reminder-message">
                {reminder.suggested_message}
              </div>
            </div>

            <button
              className="reminder-copy-btn"
              onClick={() => handleCopyMessage(reminder.suggested_message, index)}
            >
              {copiedIndex === index ? '✓ Copied!' : '📋 Copy Message'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ReminderSection;
