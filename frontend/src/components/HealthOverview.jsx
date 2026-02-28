import React from 'react';
import '../styles/components.css';

function HealthOverview({ report, drift }) {
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Strong':  return 'risk-strong';
      case 'Stable':  return 'risk-stable';
      case 'Cooling': return 'risk-cooling';
      case 'At Risk': return 'risk-at-risk';
      default:        return 'risk-stable';
    }
  };

  const getScoreColors = (score) => {
    if (score >= 75) return { start: '#22c55e', end: '#4ade80', glow: 'rgba(34,197,94,0.35)' };
    if (score >= 50) return { start: '#3b82f6', end: '#06b6d4', glow: 'rgba(59,130,246,0.35)' };
    if (score >= 30) return { start: '#f59e0b', end: '#fbbf24', glow: 'rgba(245,158,11,0.35)' };
    return { start: '#ef4444', end: '#f87171', glow: 'rgba(239,68,68,0.35)' };
  };

  const colors = getScoreColors(report.healthScore);
  const R = 90;
  const CIRCUMFERENCE = 2 * Math.PI * R;
  const progress = (report.healthScore / 100) * CIRCUMFERENCE;

  // Tip dot position
  const tipAngle = ((report.healthScore / 100) * 360 - 90) * (Math.PI / 180);
  const tipX = 100 + R * Math.cos(tipAngle);
  const tipY = 100 + R * Math.sin(tipAngle);

  return (
    <section className="dashboard-section health-overview-section">
      <div className="health-overview-card">
        <div className="health-visual">
          <div className="health-circle">
            <svg className="circle-svg" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={colors.start} />
                  <stop offset="100%" stopColor={colors.end} />
                </linearGradient>
                <filter id="healthGlow">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Track ring */}
              <circle
                cx="100" cy="100" r={R}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="10"
              />

              {/* Glow halo */}
              <circle
                cx="100" cy="100" r={R}
                fill="none"
                stroke={colors.start}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${progress} ${CIRCUMFERENCE}`}
                transform="rotate(-90 100 100)"
                opacity="0.2"
                filter="url(#healthGlow)"
              />

              {/* Main arc */}
              <circle
                cx="100" cy="100" r={R}
                fill="none"
                stroke="url(#healthGradient)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={`${progress} ${CIRCUMFERENCE}`}
                transform="rotate(-90 100 100)"
                style={{ transition: 'stroke-dasharray 0.9s cubic-bezier(0.4,0,0.2,1)' }}
              />

              {/* Glowing tip dot */}
              {report.healthScore > 2 && (
                <circle
                  cx={tipX} cy={tipY} r="5"
                  fill={colors.end}
                  filter="url(#healthGlow)"
                  style={{ filter: `drop-shadow(0 0 6px ${colors.end})` }}
                />
              )}
            </svg>

            <div className="health-score-text">
              <span className="score-number" style={{ color: colors.end }}>
                {report.healthScore}
              </span>
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