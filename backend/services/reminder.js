const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateReminderStrategies(staleTopics, drift, userStyle, currentUserName) {
  const start = performance.now();
  console.log("Gemini reminders started")
  if (!staleTopics || staleTopics.length === 0) {
    return [];
  }

  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL });

const prompt = `
You are generating a WhatsApp message AS THE USER.

User name: ${currentUserName}

Conversation drift state: ${drift.state}
Drift score: ${drift.driftScore}

User Style Profile:
${JSON.stringify(userStyle, null, 2)}

Topics:
${JSON.stringify(staleTopics, null, 2)}

STRICT INSTRUCTIONS:

- You are the user. Never address the user by name.
- If lastMentionSender equals the user, do NOT frame it as asking yourself.
- If the other person mentioned it, ask about it naturally.
- Match the user's style profile exactly.

STYLE MATCHING RULES:
- If mostlyLowercase is true → do not capitalize sentences.
- Match avgMessageLength (keep response similar length).
- If energyLevel is "short" → keep it very short.
- If energyLevel is "long" → slightly elaborate.
- If commonSlang exists → optionally use it naturally.
- If emojiPerMessage > 0.02 → include at most 1 commonEmoji.
- If formality is "casual" → use relaxed Hinglish.
- If formality is "neutral" → avoid slang.

TIME RULES:
- Use provided daysSince only.
- If daysSince < 3 → do not mention time.
- If daysSince > 7 → casually mention time like "last week" or actual date.
- Do not invent time.

TONE RULES:
- No therapy language.
- No assistant tone.
- No meta commentary.
- No dramatic phrasing.
- Sound like a real WhatsApp message.

Return STRICT JSON:

[
  {
    "topic": "",
    "urgency": "low | medium | high",
    "suggested_message": ""
  }
]
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const end = performance.now();
  console.log(`Time taken: ${((end - start)/1000).toFixed(4)} ms`);
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Reminder reasoning parse error:", e.message);
    return [];
  }
}

module.exports = generateReminderStrategies;