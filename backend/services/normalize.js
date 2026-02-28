const normalizeChat = rawChat => {
  if (!Array.isArray(rawChat)) {
    throw new Error("Chat data must be an array");
  }  
  const cleaned = rawChat
    .map((msg) => {
      // Ensure required fields exist
      if (!msg.sender || !msg.timestamp || !msg.message || msg.message === "") {
        return null;
      }
      

      // Convert timestamp to Date object
      const parsedDate = new Date(msg.timestamp);

      if (isNaN(parsedDate.getTime())) {
        return null; // invalid date
      }

      // Remove empty messages
      const trimmedMessage = String(msg.message).trim();
      if (!trimmedMessage) {
        return null;
      }

      return {
        sender: String(msg.sender).trim(),
        timestamp: parsedDate,
        message: trimmedMessage
      };
    })
    .filter(Boolean); // remove nulls

  // Sort chronologically
  cleaned.sort((a, b) => a.timestamp - b.timestamp);

  return cleaned;

} 
module.exports = normalizeChat;