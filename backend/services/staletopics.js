function getStaleTopics(memory) {
  if (!memory.unresolved_topics) return [];

  return memory.unresolved_topics.map(topicObj => {
    const topicLabel =
      typeof topicObj === "string"
        ? topicObj
        : topicObj.topic || topicObj;

    return {
      topic: topicLabel
    };
  });
}
module.exports = getStaleTopics