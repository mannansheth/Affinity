function extractUserStyle(chat, currentUser) {
  const userMessages = chat.filter(msg => msg.sender.toLowerCase().includes( currentUser.toLowerCase()));

  if (!userMessages || userMessages.length === 0) {
    return {};
  }

  let totalLength = 0;
  let totalSentences = 0;
  let lowercaseMessages = 0;
  let questionCount = 0;
  let exclamationCount = 0;

  const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
  const slangDictionary = [
    "bhai", "bro", "yaar", "abe", "arre", "lol", "lmao",
    "btw", "scene", "kya", "acha", "haan", "hmm"
  ];

  const greetingWords = ["hey", "hi", "hello", "yo", "oye"];
  const closers = ["ok", "okay", "cool", "fine", "done"];

  let emojiCount = 0;
  let emojiFrequencyMap = {};
  let slangFrequency = {};
  let greetingFrequency = {};
  let closerFrequency = {};

  userMessages.forEach(msg => {
    const text = msg.message.trim();
    if (!text) return;

    totalLength += text.length;

    const sentences = text.split(/[.!?]/).filter(Boolean);
    totalSentences += sentences.length;

    if (text === text.toLowerCase()) lowercaseMessages++;

    if (text.includes("?")) questionCount++;
    if (text.includes("!")) exclamationCount++;

    // Emojis
    const emojis = text.match(emojiRegex);
    if (emojis) {
      emojiCount += emojis.length;
      emojis.forEach(e => {
        emojiFrequencyMap[e] = (emojiFrequencyMap[e] || 0) + 1;
      });
    }

    // Slang
    const words = text.toLowerCase().split(/\s+/);
    words.forEach(word => {
      if (slangDictionary.includes(word)) {
        slangFrequency[word] = (slangFrequency[word] || 0) + 1;
      }
    });

    // Greetings
    words.forEach(word => {
      if (greetingWords.includes(word)) {
        greetingFrequency[word] = (greetingFrequency[word] || 0) + 1;
      }
    });

    // Closers
    words.forEach(word => {
      if (closers.includes(word)) {
        closerFrequency[word] = (closerFrequency[word] || 0) + 1;
      }
    });
  });

  const avgLength = totalLength / userMessages.length;
  const avgSentenceCount = totalSentences / userMessages.length;

  const topEmoji = Object.entries(emojiFrequencyMap)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  const topSlang = Object.entries(slangFrequency)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  const topGreeting = Object.entries(greetingFrequency)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  const topCloser = Object.entries(closerFrequency)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  return {
    avgMessageLength: Math.round(avgLength),
    avgSentenceCount: Number(avgSentenceCount.toFixed(2)),
    mostlyLowercase: lowercaseMessages > userMessages.length * 0.6,
    questionRatio: Number((questionCount / userMessages.length).toFixed(2)),
    exclamationRatio: Number((exclamationCount / userMessages.length).toFixed(2)),
    emojiPerMessage: Number((emojiCount / userMessages.length).toFixed(2)),
    commonEmoji: topEmoji,
    commonSlang: topSlang,
    commonGreeting: topGreeting,
    commonCloser: topCloser,
    energyLevel:
      avgLength < 20
        ? "short"
        : avgLength < 50
        ? "medium"
        : "long",
    formality:
      topSlang || lowercaseMessages > userMessages.length * 0.5
        ? "casual"
        : "neutral"
  };
}

module.exports = extractUserStyle;