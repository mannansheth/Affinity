import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Dot
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  return (
    <div style={tooltipStyles.box}>
      <p style={tooltipStyles.label}>{label}</p>
      <p style={{ ...tooltipStyles.value, color: val >= 0 ? '#4ade80' : '#f87171' }}>
        {val?.toFixed(3)}
      </p>
    </div>
  );
};

const tooltipStyles = {
  box: {
    background: 'rgba(15,23,42,0.95)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 6,
    padding: '8px 14px',
  },
  label: { fontSize: 11, color: '#475569', marginBottom: 4, fontFamily: 'Helvetica Neue, Arial, sans-serif' },
  value: { fontSize: 14, fontWeight: 600, fontFamily: 'Helvetica Neue, Arial, sans-serif' },
};

const TrendSection = ({
  timeSeries,
  trendPhysics,
  recommendations,
  narrative,
  volatilitySpikes,
  attachmentStyle
}) => {

  if (!timeSeries?.timestamps?.length) {
    return (
      <section className="dashboard-section">
        <p style={{ color: '#475569', fontSize: 14 }}>
          No trend data available.
        </p>
      </section>
    );
  }

  const chartData = timeSeries.timestamps.map((t, i) => ({
    time: new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    sentiment: timeSeries.sentimentSeries[i],
    isSpike: volatilitySpikes?.includes(i)
  }));

  const { projectedDirection, confidence } = trendPhysics || {};

  const directionColor =
    projectedDirection === 'Improving' ? '#4ade80' :
    projectedDirection === 'Declining' ? '#f87171' : '#64748b';

  const attachmentDescriptions = {
    "Secure Leaning": "Interaction patterns suggest emotional balance and steady engagement.",
    "Avoidant Tendencies": "Delays and declining tone may indicate distancing behaviour.",
    "Anxious Reactivity": "Elevated volatility suggests heightened emotional responsiveness.",
    "Balanced": "No dominant attachment pattern detected."
  };

  return (
    <section className="dashboard-section">
      <h2 className="section-title">Emotional Trend Analysis</h2>

      {/* Narrative */}
      {narrative && (
        <div style={styles.narrativeBox}>
          <p style={styles.narrativeText}>{narrative}</p>
        </div>
      )}

      {/* Attachment Card */}
      {attachmentStyle && (
        <div style={styles.attachmentBox}>
          <span style={styles.attachmentLabel}>Relational Pattern</span>
          <span style={styles.attachmentValue}>{attachmentStyle}</span>
          <p style={styles.attachmentDescription}>
            {attachmentDescriptions[attachmentStyle]}
          </p>
        </div>
      )}

      {/* Chart */}
      <div style={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData} margin={{ top: 8, right: 16, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="time"
              tick={{ fill: '#334155', fontSize: 11 }}
              tickLine={false}
            />
            <YAxis
              domain={[-1, 1]}
              tick={{ fill: '#334155', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
            <Line
              type="monotone"
              dataKey="sentiment"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={(props) =>
                props.payload.isSpike ? (
                  <Dot {...props} r={5} fill="#f87171" strokeWidth={1} />
                ) : null
              }
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Volatility Spike Summary */}
      {volatilitySpikes.length > 0 && (
        <div style={styles.spikeBox}>
          <p style={styles.spikeTitle}>Emotional Spike Events</p>
          <p style={styles.spikeText}>
            {volatilitySpikes.length} significant emotional fluctuation{volatilitySpikes.length > 1 ? "s detected" : " detected"}.
          </p>
        </div>
      )}

      {/* Recommendations */}
      {recommendations?.length > 0 && (
        <div style={styles.recBox}>
          <p style={styles.recTitle}>Agent Recommendations</p>
          {recommendations.map((rec, idx) => (
            <div key={idx} style={styles.recRow}>
              <span style={styles.recDot} />
              <span style={styles.recText}>{rec}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

const styles = {
  narrativeBox: {
    background: 'rgba(59,130,246,0.08)',
    border: '1px solid rgba(59,130,246,0.2)',
    borderRadius: 6,
    padding: 16,
    marginBottom: 20,
  },
  narrativeText: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 1.7,
  },
  attachmentBox: {
    background: 'rgba(0,0,0,0.15)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 6,
    padding: 16,
    marginBottom: 20,
  },
  attachmentLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: '#475569',
  },
  attachmentValue: {
    display: 'block',
    fontSize: 16,
    fontWeight: 600,
    marginTop: 6,
    color: '#cbd5e1',
  },
  attachmentDescription: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 8,
  },
  chartWrap: {
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: 6,
    padding: '16px 8px 8px',
    marginBottom: 24,
  },
  spikeBox: {
    background: 'rgba(248,113,113,0.08)',
    border: '1px solid rgba(248,113,113,0.25)',
    borderRadius: 6,
    padding: 14,
    marginBottom: 24,
  },
  spikeTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#f87171',
    marginBottom: 6,
  },
  spikeText: {
    fontSize: 13,
    color: '#fca5a5',
  },
  recBox: {
    background: 'rgba(0,0,0,0.15)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 4,
    padding: 18,
  },
  recTitle: {
    fontSize: 12,
    color: '#475569',
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  recRow: {
    display: 'flex',
    gap: 10,
    marginBottom: 10,
  },
  recDot: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    background: '#3b82f6',
    marginTop: 7,
  },
  recText: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 1.6,
  },
};

export default TrendSection;