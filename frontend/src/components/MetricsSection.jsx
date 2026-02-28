import React from 'react';
import '../styles/components.css';

function MetricsSection({ features, drift }) {
  const formatNumber = (num, decimals = 2) => {
    return num.toFixed(decimals);
  };

  const formatDelay = (ms) => {
    const seconds = (ms / 1000).toFixed(1);
    return `${seconds}s`;
  };

  const getSentimentLabel = (sentiment) => {
    if (sentiment > 0.2) return 'Positive';
    if (sentiment < -0.2) return 'Negative';
    return 'Neutral';
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return '📈';
    if (trend < 0) return '📉';
    return '➡️';
  };

  const metrics = [
    {
      label: 'Avg Response Delay',
      value: formatDelay(features.avgResponseDelay),
      icon: '⏱️',
    },
    {
      label: 'Avg Message Length',
      value: formatNumber(features.avgMessageLength),
      icon: '💬',
    },
    {
      label: 'Avg Sentiment',
      value: getSentimentLabel(features.avgSentiment),
      icon: '😊',
    },
    {
      label: 'Sentiment Trend',
      value: `${features.sentimentTrend > 0 ? '+' : ''}${formatNumber(features.sentimentTrend, 3)}`,
      trend: getTrendIcon(features.sentimentTrend),
      icon: '📊',
    },
    {
      label: 'Planning Signals',
      value: features.planningSignals,
      icon: '🎯',
    },
    {
      label: 'Message Initiation',
      value: `${features.initiationCount[Object.keys(features.initiationCount)[0]]} each`,
      icon: '🔄',
    },
  ];

  return (
    <section className="dashboard-section metrics-section">
      <h2 className="section-title">Behavioral Metrics</h2>
      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <div className="metric-header">
              <span className="metric-icon">{metric.icon}</span>
              <span className="metric-label">{metric.label}</span>
            </div>
            <div className="metric-value-container">
              <span className="metric-value">{metric.value}</span>
              {metric.trend && <span className="metric-trend">{metric.trend}</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MetricsSection;
