import React, { useState } from 'react';
import '../styles/components.css';

function ActionSection({ action }) {
  const [selectedInterest, setSelectedInterest] = useState(null);

  const primaryAction = action.primaryAction;
  const reasoning = action.reasoning;

  if (!primaryAction) return null;

  const interests = primaryAction.reel_suggestion || [];

  const handleSearchInstagram = () => {
    const searchTerm = selectedInterest || interests[0] || 'lifestyle';
    const instagramUrl = `https://www.instagram.com/explore/tags/${searchTerm.toLowerCase().replace(/\s+/g, '')}`;
    window.open(instagramUrl, '_blank');
  };

  return (
    <section className="dashboard-section action-section">
      <h2 className="section-title">Suggested Actions</h2>
      <div className="action-container">
        <div className="action-card primary-action">
          <div className="action-header">
            <div className="action-badge">💡</div>
            <div>
              <h3 className="action-title">Recommended Engagement</h3>
              <p className="action-subtitle">Send a Reel Based on Shared Interest</p>
            </div>
          </div>

          {primaryAction.type === 'reel_suggestion' && (
            <div className="action-content">
              <div className="interests-list">
                <p className="interests-label">Select a Topic:</p>
                <div className="interests-tags">
                  {interests.map((interest, index) => (
                    <button
                      key={index}
                      className={`interest-tag interest-tag--selectable${selectedInterest === interest ? ' interest-tag--selected' : ''}`}
                      onClick={() => setSelectedInterest(selectedInterest === interest ? null : interest)}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {selectedInterest && (
                <p className="interest-preview">
                  Will search: <strong>#{selectedInterest.toLowerCase().replace(/\s+/g, '')}</strong>
                </p>
              )}

              <div className="action-buttons">
                <button
                  className={`action-btn search-btn${!selectedInterest ? ' search-btn--disabled' : ''}`}
                  onClick={handleSearchInstagram}
                  disabled={!selectedInterest}
                >
                  🔍 Search on Instagram
                </button>
              </div>
            </div>
          )}

          <div className="action-reasoning">
            <p className="reasoning-label">Why this action:</p>
            <p className="reasoning-text">{reasoning}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ActionSection;