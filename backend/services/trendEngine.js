function calculateSlope(values) {
  if (!values || values.length < 2) return 0;

  const n = values.length;
  const xMean = (n - 1) / 2;
  const yMean = values.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (i - xMean) * (values[i] - yMean);
    denominator += (i - xMean) ** 2;
  }

  if (denominator === 0) return 0;

  return numerator / denominator;
}

function calculateVolatility(values) {
  if (!values || values.length === 0) return 0;

  const mean =
    values.reduce((a, b) => a + b, 0) / values.length;

  const variance =
    values.reduce((a, b) => a + (b - mean) ** 2, 0) /
    values.length;

  return Math.sqrt(variance);
}

function calculateAcceleration(values) {
  if (!values || values.length < 4) return 0;

  const mid = Math.floor(values.length / 2);

  const slope1 = calculateSlope(values.slice(0, mid));
  const slope2 = calculateSlope(values.slice(mid));

  return slope2 - slope1;
}

function detectRegimeShift(series) {
  if (!series || series.length < 6) return false;

  const recent = series.slice(-3);
  const earlier = series.slice(0, series.length - 3);

  const recentAvg =
    recent.reduce((a, b) => a + b, 0) / recent.length;

  const earlierAvg =
    earlier.reduce((a, b) => a + b, 0) / earlier.length;

  const volatility = calculateVolatility(series);

  if (volatility === 0) return false;

  return Math.abs(recentAvg - earlierAvg) > volatility * 1.2;
}

// =============================
// 3️⃣ PHASE CLASSIFICATION
// =============================

function classifyPhase({ slope, volatility, acceleration }) {
  if (slope > 0.05 && volatility < 0.25) return "Growth";
  if (slope < -0.05 && acceleration < -0.02) return "Cooling";
  if (volatility > 0.35) return "Volatile";
  if (Math.abs(slope) < 0.02) return "Plateau";
  return "Stable";
}

// =============================
// 4️⃣ TREND PHYSICS ENGINE
// =============================

function computeTrendPhysics(timeSeries) {
  const sentimentSeries =
    timeSeries?.sentimentSeries || [];

  const slope = calculateSlope(sentimentSeries);
  const volatility =
    calculateVolatility(sentimentSeries);
  const acceleration =
    calculateAcceleration(sentimentSeries);
  const regimeShift =
    detectRegimeShift(sentimentSeries);

  const phase = classifyPhase({
    slope,
    volatility,
    acceleration
  });

  let projectedDirection = "Stable";

  if (slope > 0.05) projectedDirection = "Improving";
  if (slope < -0.05) projectedDirection = "Declining";

  const confidence =
    60 +
    Math.min(Math.abs(slope) * 100, 20) +
    Math.min(volatility * 50, 20);

  return {
    slope,
    volatility,
    acceleration,
    regimeShift,
    phase,
    projectedDirection,
    confidence: Math.min(Math.round(confidence), 95)
  };
}

// =============================
// 5️⃣ HUMAN NARRATIVE LAYER
// =============================

function generateNarrative(phase) {
  switch (phase) {
    case "Growth":
      return "The emotional tone is gradually strengthening. Interaction momentum appears healthy.";

    case "Cooling":
      return "Engagement appears to be softening. Proactive positive interaction may help rebalance dynamics.";

    case "Volatile":
      return "Emotional variability is elevated. Conversation dynamics may feel unpredictable.";

    case "Plateau":
      return "The conversation appears stable but emotionally neutral.";

    default:
      return "Interaction dynamics appear steady with no major directional shift.";
  }
}

// =============================
// 6️⃣ RECOMMENDATION ENGINE
// =============================

function deriveRecommendations(trendPhysics, features) {
  const recs = [];

  const {
    slope,
    volatility,
    acceleration,
    regimeShift
  } = trendPhysics;

  if (slope < -0.05) {
    recs.push(
      "Emotional tone is gradually declining. Consider initiating positive engagement."
    );
  }

  if (acceleration < -0.03) {
    recs.push(
      "Decline is accelerating. Immediate supportive communication recommended."
    );
  }

  if (volatility > 0.3) {
    recs.push(
      "High emotional volatility detected. Avoid sensitive topics temporarily."
    );
  }

  if (regimeShift) {
    recs.push(
      "Recent emotional regime shift detected."
    );
  }

  if (
    features?.planningSignals > 50 &&
    slope <= 0
  ) {
    recs.push(
      "Conversation is planning-heavy but emotionally flat. Consider adding personal engagement."
    );
  }

  if (recs.length === 0) {
    recs.push(
      "Conversation dynamics appear stable. Maintain current engagement pattern."
    );
  }

  return recs;
}

function detectVolatilitySpikes(series, thresholdMultiplier = 1.5) {
  const volatility = calculateVolatility(series);
  const spikes = [];

  for (let i = 0; i < series.length; i++) {
    if (Math.abs(series[i]) > volatility * thresholdMultiplier) {
      spikes.push(i);
    }
  }

  return spikes;
}

// =============================
// 7️⃣ MAIN ORCHESTRATOR
// =============================

function trendEngine(timeSeries, features) {

  const trendPhysics =
    computeTrendPhysics(timeSeries);

  const narrative =
    generateNarrative(trendPhysics.phase);
  const volatilitySpikes = detectVolatilitySpikes(timeSeries.sentimentSeries);
  const recommendations =
    deriveRecommendations(
      trendPhysics,
      features
    );

  return {
    trendPhysics,
    volatilitySpikes,
    narrative,
    recommendations
  };
}
module.exports = trendEngine