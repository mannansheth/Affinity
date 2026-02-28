import React from 'react';
import '../styles/components.css';

function MemorySection({ memory }) {
  const renderTagList = (items) => {
    return items.map((item, index) => (
      <span key={index} className="tag">
        {item}
      </span>
    ));
  };

  const categories = [
    { key: 'interests', label: 'Interests', icon: '🎯' },
    { key: 'shared_interests', label: 'Shared Interests', icon: '🤝' },
    { key: 'important_events', label: 'Important Events', icon: '📅' },
    { key: 'goals', label: 'Goals', icon: '🎪' },
    { key: 'stress_points', label: 'Stress Points', icon: '⚠️' },
    { key: 'recurring_themes', label: 'Recurring Themes', icon: '🔄' },
    { key: 'unresolved_topics', label: 'Unresolved Topics', icon: '❓' },
  ];

  return (
    <section className="dashboard-section memory-section">
      <h2 className="section-title">Memory Insights</h2>
      <div className="memory-grid">
        {categories.map((category) => (
          <div key={category.key} className="memory-card">
            <div className="memory-card-header">
              <span className="memory-icon">{category.icon}</span>
              <h3 className="memory-title">{category.label}</h3>
            </div>
            <div className="memory-tags">
              {memory[category.key] && memory[category.key].length > 0 ? (
                renderTagList(memory[category.key])
              ) : (
                <span className="empty-text">No data</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MemorySection;
