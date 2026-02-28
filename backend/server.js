const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const FormData = require("form-data");
const upload = multer();
dotenv.config();
const axios = require("axios");
const normalizeChat = require("./services/normalize")
const extractFeatures = require("./services/features")
const calculateDrift = require("./services/drift")
const extractMemory = require('./services/memory');
const getStaleTopics = require('./services/staletopics');
const generateReminderStrategies = require('./services/reminder');
const extractUserStyle = require("./services/userstyle");
const evaluateRelationship = require("./services/evaluator");
const actionOrchestrator = require("./services/actionOrchestrator");
const generateTimeSeries = require("./services/timeSeries");
const trendEngine = require("./services/trendEngine");
const classifyAttachment = require("./services/classifyattachment");

const app = express();
app.use(cors({ origin: ["http://127.0.0.1:3000", "http://localhost:3000", "http://192.168.1.202:3000"], credentials: true }));
app.use(express.json({limit:"10mb"}));
const {
    GEMINI_API_KEY,
    PORT
} = process.env;

app.post("/analyze", upload.single("file"), async (req, res) => {
  try {
    const currentUser = req.body.user;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Convert file buffer to string
    const rawText = req.file.buffer.toString("utf-8");

    // Send raw text to Flask parser
    const parseResponse = await axios.post(
      "http://localhost:8000/parse-chat",
      { raw_text: rawText }
    );

    const chatData = parseResponse.data.messages;

    if (!chatData || !Array.isArray(chatData)) {
      return res.status(400).json({ error: "Invalid parsed chat format" });
    }

    const normalizedChat = normalizeChat(chatData);

    const messages = normalizedChat.map(msg => msg.message);

    // Call Flask sentiment service
    const sentimentResponse = await axios.post(
      'http://localhost:8000/analyze-sentiment',
      { messages }
    );

    const sentimentScores = sentimentResponse.data.scores.map(s => s.score);

    const features = extractFeatures(normalizedChat, sentimentScores);

    const drift = calculateDrift(features, normalizedChat);

    const memoryProfile = await extractMemory(normalizedChat);

    const staleTopics = getStaleTopics(memoryProfile);

    const userStyle = extractUserStyle(normalizedChat, currentUser);

    const timeSeries = generateTimeSeries(normalizedChat, sentimentScores);
    const {
      trendPhysics,
      volatilitySpikes,
      narrative,
      recommendations
    } = trendEngine(timeSeries, features);

    const attachmentType = classifyAttachment(features, trendPhysics);

    const reminderActions = await generateReminderStrategies(
      staleTopics, 
      drift,
      userStyle,
      currentUser
    );
    const relationshipReport = evaluateRelationship({
      features,
      drift,
      memory: memoryProfile,  
      staleTopics
    });
    const orchestratedActions = actionOrchestrator({
      relationshipReport,
      staleTopics,
      reminderActions,
      reelSuggestions: [...memoryProfile.interests, ...memoryProfile.shared_interests]
    });
    return res.json({
      status: "success",
      features,
      drift,
      memory: memoryProfile,
      timeSeries,
      attachmentType,          
      trendPhysics,
      volatilitySpikes,
      recommendations,
      reminders: reminderActions,
      relationshipReport,
      orchestratedActions,
      narrative
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


app.listen(PORT || 5005, () => {
    console.log("Started");
})