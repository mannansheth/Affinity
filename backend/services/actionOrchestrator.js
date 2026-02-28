function actionOrchestrator({
  relationshipReport,
  staleTopics,
  reminderActions,
  reelSuggestions
}) {
  const { riskLevel } = relationshipReport;

  let primaryAction = null;
  let secondaryAction = null;
  let reasoning = "";

  // -----------------------------
  // 🔴 AT RISK
  // -----------------------------
  if (riskLevel === "At Risk") {

    if (reminderActions && reminderActions.length > 0) {
      primaryAction = {
        type: "emotional_repair",
        ...reminderActions[0]
      };
      reasoning = "High drift + unresolved topic detected";
    } else {
      primaryAction = {
        type: "direct_reconnect",
        message: "hey, been a bit disconnected lately — sab theek?"
      };
      reasoning = "High drift without clear unresolved topics";
    }

    if (reelSuggestions && reelSuggestions.length > 0) {
      secondaryAction = {
        type: "soft_reengagement",
        reel_suggestion : reelSuggestions
      };
    }
  }

  // -----------------------------
  // 🟠 COOLING
  // -----------------------------
  else if (riskLevel === "Cooling") {

    if (reminderActions && reminderActions.length > 0) {
      primaryAction = {
        type: "follow_up",
        ...reminderActions[0]
      };
      reasoning = "Cooling relationship + pending topic";
    } else if (reelSuggestions && reelSuggestions.length > 0) {
      primaryAction = {
        type: "reel_suggestion",
        reel_suggestion : reelSuggestions
      };
      reasoning = "Cooling detected — boost engagement via shared interest";
    } else {
      primaryAction = {
        type: "casual_ping",
        message: "kya chal raha hai aajkal?"
      };
      reasoning = "Cooling with no strong triggers";
    }
  }

  // -----------------------------
  // 🟢 STABLE / STRONG
  // -----------------------------
  else {

    if (reelSuggestions && reelSuggestions.length > 0) {
      primaryAction = {
        type: "reel_suggestion",
        reel_suggestion : reelSuggestions
      };
      reasoning = "Healthy connection — maintain engagement";
    } else {
      primaryAction = {
        type: "light_checkin",
        message: "kya scene hai?"
      };
      reasoning = "Healthy state — light engagement suggested";
    }
  }

  return {
    primaryAction,
    secondaryAction,
    reasoning
  };
}

module.exports = actionOrchestrator;