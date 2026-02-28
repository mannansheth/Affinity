function generateTimeSeries(chat, sentimentScores, windowSize = 20) {
  const series = {
    timestamps: [],
    sentimentSeries: [],
    responseDelaySeries: [],
    messageLengthSeries: []
  };

  for (let i = 0; i < chat.length; i += windowSize) {
    const windowChat = chat.slice(i, i + windowSize);
    const windowSentiment = sentimentScores.slice(i, i + windowSize);

    if (windowChat.length === 0) continue;

    const avgSentiment =
      windowSentiment.reduce((a, b) => a + b, 0) / windowSentiment.length;

    const avgLength =
      windowChat.reduce((a, m) => a + m.message.length, 0) / windowChat.length;

    series.timestamps.push(windowChat[windowChat.length - 1].timestamp);
    series.sentimentSeries.push(avgSentiment);
    series.messageLengthSeries.push(avgLength);
  }

  return series;
}
module.exports = generateTimeSeries;