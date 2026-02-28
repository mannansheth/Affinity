const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


async function extractMemory(chat) {
  const start = performance.now();
  console.log("Gemini extract memory started")
  try {
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL });

    // Use only last 120 messages for safety
    const recentChat = chat.slice(-120);

    const formattedConversation = recentChat
      .map(msg => `${msg.sender}: ${msg.message}`)
      .join("\n");

    const prompt = `
You are a relationship intelligence system.

Analyze the following conversation and extract structured memory.

Return STRICTLY valid JSON in this format:

{
  "interests": [],
  "important_events": [],
  "goals": [],
  "stress_points": [],
  "unresolved_topics": [],
  "recurring_themes": [],
  "shared_interests": []
}

Guidelines:
- Only extract information explicitly mentioned.
- important_events must mention the event not the timestamp
- If something is unclear, do not guess.
- Keep entries concise.
- No explanations.
- JSON only.

Conversation:
${formattedConversation}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean possible markdown wrapping
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);
    const end = performance.now();
    console.log(`Time taken: ${((end - start)/1000).toFixed(4)} ms`);
    return parsed;

  } catch (error) {
    console.error("Memory extraction failed:", error.message);

    return {
      interests: [],
      important_events: [],
      goals: [],
      stress_points: [],
      unresolved_topics: [],
      recurring_themes: [],
      shared_interests: []
    };
  }
}

module.exports = extractMemory;