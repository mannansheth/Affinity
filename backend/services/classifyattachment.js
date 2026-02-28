function classifyAttachment(features, trendPhysics) {
  const delay = features.avgResponseDelay;
  const volatility = trendPhysics.volatility;
  const slope = trendPhysics.slope;

  if (delay < 3600 && volatility < 0.2)
    return "Secure Leaning";

  if (delay > 86400 && slope < 0)
    return "Avoidant Tendencies";

  if (volatility > 0.35)
    return "Anxious Reactivity";

  return "Balanced";
}

module.exports = classifyAttachment;