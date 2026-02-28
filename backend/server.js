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
    // const memoryProfile = {
    //     "interests": [
    //         "Gym",
    //         "Turf/Sports"
    //     ],
    //     "important_events": [
    //         "A 'crazy jhagda' (fight/argument) occurred at the gym between two uncles. One uncle dropped a heavy weight accidentally on another's foot, leading to an argument, demands for strict action, and a refund from the gym."
    //     ],
    //     "goals": [
    //         "Uday wants to go to the gym",
    //         "Uday wants to play turf",
    //         "Uday wants Mannan to come with Ishan"
    //     ],
    //     "stress_points": [
    //         "Waiting for Mannan",
    //         "A gym incident involving a dropped weight, an argument, and a threatened gym cancellation"
    //     ],
    //     "unresolved_topics": [
    //         "Mannan confirming for turf",
    //         "Mannan's current location when Uday was waiting",
    //         "Outcome of the gym refund demand"
    //     ],
    //     "recurring_themes": [
    //         "Planning gym/sports activities",
    //         "Checking availability and coordinating plans"
    //     ],
    //     "shared_interests": [
    //         "Gym",
    //         "Turf/Sports"
    //     ]
    // }
    const staleTopics = getStaleTopics(memoryProfile);
    console.log(staleTopics.length)
    const userStyle = extractUserStyle(normalizedChat, currentUser);
    console.log(userStyle);
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
      reminders: reminderActions,
      relationshipReport,
      orchestratedActions
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


app.listen(PORT || 5005, () => {
    console.log("Started");
})