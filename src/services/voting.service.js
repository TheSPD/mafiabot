function voting() {
  return {
    create: create,
  };
}

function create(models) {
  function vote(fromId, toId) {
    alivePlayers = models.player.getAlivePlayers();
    if (!alivePlayers.inclues(fromId)) {
      throw "Only alive players can vote";
    }

    if (!alivePlayers.inclues(toId)) {
      throw "Only votes against alive players will be counted";
    }
    
    models.voting.vote(fromId, toId);
  }

  function getVoteCounts() {
    return models.voting.voteCounts();
  }

  function remainingVoters() {
    all = models.player.getAlivePlayers();
    voters = models.voting.voters(0);

    return all.filter((player) => !voters.include(player));
  }

  return {
    vote: vote,
    getVoteCounts: getVoteCounts,
    remainingVoters: remainingVoters,
  };
}

module.exports = voting();
