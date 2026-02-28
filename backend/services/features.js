function extractFeatures(chat, sentimentScores) {
  if (!chat || chat.length === 0) {
    throw new Error("Chat is empty");
  } 

  if (!sentimentScores || sentimentScores.length !== chat.length) {
    throw new Error("Sentiment scores missing or length mismatch");
  }

  let responseDelays = [];
  let messageLengths = [];

  let vulnerabilityMentions = 0;
  let conflictSignals = 0;
  let planningSignals = 0;

  const vulnerabilityKeywords = ["stress", "tired", "sad", "worried", "anxious", "upset"];
  const conflictKeywords = ["fine.", "whatever", "leave it", "okay then", "forget it"];
  const planningKeywords = ["when", "where", "confirm", "coming", "meeting", "tomorrow"];

  let lastSender = null;
  let lastTimestamp = null;

  let initiationCount = {};

  for (let i = 0; i < chat.length; i++) {
    const msg = chat[i];

    // Use sentiment score FROM FLASK
    const score = sentimentScores[i];

    // Message length
    messageLengths.push(msg.message.length);

    // Keyword detection
    const lowerMsg = msg.message.toLowerCase();

    if (vulnerabilityKeywords.some(word => lowerMsg.includes(word))) {
      vulnerabilityMentions++;
    }

    if (conflictKeywords.some(word => lowerMsg.includes(word))) {
      conflictSignals++;
    }

    if (planningKeywords.some(word => lowerMsg.includes(word))) {
      planningSignals++;
    }

    // Response delay
    if (lastSender && msg.sender !== lastSender) {
      const delay = (msg.timestamp - lastTimestamp) / 1000;
      responseDelays.push(delay);
    }

    // Initiation tracking
    if (!initiationCount[msg.sender]) {
      initiationCount[msg.sender] = 0;
    }

    if (i === 0 || chat[i - 1].sender !== msg.sender) {
      initiationCount[msg.sender]++;
    }

    lastSender = msg.sender;
    lastTimestamp = msg.timestamp;
  }

  // ---- Aggregates ----

  const avgResponseDelay =
    responseDelays.length > 0
      ? responseDelays.reduce((a, b) => a + b, 0) / responseDelays.length
      : 0;

  const avgMessageLength =
    messageLengths.reduce((a, b) => a + b, 0) / messageLengths.length;

  const avgSentiment =
    sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length;

  // ---- Trend Calculation ----

  const mid = Math.floor(sentimentScores.length / 2);

  const firstHalfSentiment =
    sentimentScores.slice(0, mid).reduce((a, b) => a + b, 0) / (mid || 1);

  const secondHalfSentiment =
    sentimentScores.slice(mid).reduce((a, b) => a + b, 0) /
    (sentimentScores.length - mid || 1);

  const sentimentTrend = secondHalfSentiment - firstHalfSentiment;

  const firstHalfLength =
    messageLengths.slice(0, mid).reduce((a, b) => a + b, 0) / (mid || 1);

  const secondHalfLength =
    messageLengths.slice(mid).reduce((a, b) => a + b, 0) /
    (messageLengths.length - mid || 1);

  const lengthTrend = secondHalfLength - firstHalfLength;

  return {
    avgResponseDelay,
    avgMessageLength,
    avgSentiment,
    sentimentTrend,
    lengthTrend,
    vulnerabilityMentions,
    conflictSignals,
    planningSignals,
    initiationCount
  };
}

module.exports = extractFeatures;