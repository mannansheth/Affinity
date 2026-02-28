function evaluateRelationship({
  features,
  drift,
  memory,
  staleTopics
}) {

  let healthScore = 100;
  const keySignals = [];

  // -----------------------------
  // 1️⃣ Drift Penalty
  // -----------------------------

  if (drift.state === "Cooling") {
    healthScore -= 15;
    keySignals.push("Engagement cooling detected");
  }

  if (drift.state === "At Risk") {
    healthScore -= 30;
    keySignals.push("High emotional drift detected");
  }

  // -----------------------------
  // 2️⃣ Response Delay Penalty
  // -----------------------------

  if (features.avgResponseDelay > 3600 * 6) { // >6 hours
    healthScore -= 10;
    keySignals.push("Slow response pattern");
  }

  // -----------------------------
  // 3️⃣ Sentiment Trend
  // -----------------------------

  if (features.sentimentTrend < -0.2) {
    healthScore -= 10;
    keySignals.push("Sentiment declining over time");
  }

  if (features.sentimentTrend > 0.2) {
    healthScore += 5;
    keySignals.push("Sentiment improving");
  }

  // -----------------------------
  // 4️⃣ Initiation Imbalance
  // -----------------------------

  const initiationValues = Object.values(features.initiationCount || {});
  if (initiationValues.length === 2) {
    const diff = Math.abs(initiationValues[0] - initiationValues[1]);
    if (diff > 15) {
      healthScore -= 10;
      keySignals.push("Initiation imbalance detected");
    }
  }

  // -----------------------------
  // 5️⃣ Unresolved Topics
  // -----------------------------

  if (staleTopics && staleTopics.length > 0) {
    healthScore -= staleTopics.length * 5;
    keySignals.push("Pending unresolved topics");
  }

  // -----------------------------
  // 6️⃣ Shared Interests Bonus
  // -----------------------------

  if (memory.shared_interests && memory.shared_interests.length > 0) {
    healthScore += 10;
    keySignals.push("Strong shared interests detected");
  }

  // -----------------------------
  // 7️⃣ Planning Signals Bonus
  // -----------------------------

  if (features.planningSignals > 3) {
    healthScore += 5;
    keySignals.push("Active future planning observed");
  }

  // -----------------------------
  // Boundaries
  // -----------------------------

  healthScore = Math.max(0, Math.min(100, healthScore));

  // -----------------------------
  // Risk Level
  // -----------------------------

  let riskLevel = "Strong";

  if (healthScore < 75) riskLevel = "Stable";
  if (healthScore < 55) riskLevel = "Cooling";
  if (healthScore < 35) riskLevel = "At Risk";

  // -----------------------------
  // Primary Recommendation
  // -----------------------------

  let primaryRecommendation = "Maintain current engagement rhythm";

  if (riskLevel === "Cooling") {
    primaryRecommendation = "Light reconnection recommended";
  }

  if (riskLevel === "At Risk") {
    primaryRecommendation = "Proactive emotional repair suggested";
  }

  return {
    healthScore,
    riskLevel,
    keySignals,
    primaryRecommendation
  };
}

module.exports = evaluateRelationship;