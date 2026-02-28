import React from 'react';
import '../styles/components.css';

function HealthOverview({ report, drift }) {
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Strong':
        return 'risk-strong';
      case 'Stable':
        return 'risk-stable';
      case 'Cooling':
        return 'risk-cooling';
      case 'At Risk':
        return 'risk-at-risk';
      default:
        return 'risk-stable';
    }
  };

  return (
    <section className="dashboard-section health-overview-section">
      <div className="health-overview-card">
        <div className="health-visual">
          <div className="health-circle">
            <svg className="circle-svg" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="90"
                className="circle-background"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                className="circle-progress"
                style={{
                  strokeDasharray: `${(report.healthScore / 100) * 565.48} 565.48`,
                }}
              />
            </svg>
            <div className="health-score-text">
              <span className="score-number">{report.healthScore}</span>
              <span className="score-label">/100</span>
            </div>
          </div>
        </div>

        <div className="health-info">
          <div className="health-top-info">
            <h2 className="health-title">Relationship Health</h2>
            <div className={`risk-badge ${getRiskColor(report.riskLevel)}`}>
              {report.riskLevel}
            </div>
          </div>

          <div className="health-details">
            <div className="health-detail-item">
              <span className="detail-label">Primary Recommendation</span>
              <p className="detail-value">{report.primaryRecommendation}</p>
            </div>

            <div className="health-detail-row">
              <div className="health-detail-item">
                <span className="detail-label">Drift Score</span>
                <span className="detail-value-large">{drift.driftScore}</span>
              </div>
              <div className="health-detail-item">
                <span className="detail-label">Drift State</span>
                <span className="detail-value-large">{drift.state}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HealthOverview;
