function calculateDrift(features, chat) {
  let driftScore = 0;

  // ---- Sentiment Component ----
  // If sentiment trend is negative (decline)
  if (features.sentimentTrend < 0) {
    const sentimentImpact = Math.min(Math.abs(features.sentimentTrend) * 20, 30);
    driftScore += sentimentImpact;
  }

  // ---- Message Length Component ----
  if (features.lengthTrend < 0) {
    const lengthImpact = Math.min(Math.abs(features.lengthTrend) * 0.5, 20);
    driftScore += lengthImpact;
  }

  // ---- Response Delay Component ----
  if (features.avgResponseDelay > 3600) { // > 1 hour average
    const delayImpact = Math.min((features.avgResponseDelay / 3600) * 10, 25);
    driftScore += delayImpact;
  }

  // ---- Initiation Imbalance ----
  const initiationValues = Object.values(features.initiationCount);
  if (initiationValues.length === 2) {
    const diff = Math.abs(initiationValues[0] - initiationValues[1]);
    const imbalanceImpact = Math.min(diff * 2, 15);
    driftScore += imbalanceImpact;
  }

  driftScore = Math.min(Math.round(driftScore), 100);

  const state = classifyState(driftScore, features);

  return {
    driftScore,
    state
  };
}

function classifyState(driftScore, features) {
  if (features.conflictSignals > 2) {
    return "Conflict";
  }

  if (driftScore < 40) {
    return "Stable";
  } else if (driftScore < 70) {
    return "Cooling";
  } else {
    return "At Risk";
  }
}

module.exports = calculateDrift;