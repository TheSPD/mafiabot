function votingApi() {
  // Currently using lists for data layer
  var votes = {};

  function reset() {
    votes = {};
  }

  function vote(fromId, toId) {
    votes[fromId] = toId;
  }

  function voteCounts() {
    freqMap = {};
    Object.values(votes).forEach((votedFor) => {
      if (freqMap[votedFor] === undefined) {
        freqMap[votedFor] = 1;
      } else {
        freqMap[votedFor]++;
      }
    });

    return freqMap;
  }

  function voters() {
    return Object.keys(votes);
  }

  return {
    reset: reset,
    vote: vote,
    voteCounts: voteCounts,
    voters: voters,
  };
}

module.exports = votingApi();
