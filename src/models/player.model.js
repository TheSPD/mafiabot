function playerApi() {
  // Currently using lists for data layer
  var listOfPlayers = [];
  var listOfAlivePlayers = [];
  var listOfMafiaPlayers = [];

  function reset() {
    listOfPlayers = [];
    listOfAlivePlayers = [];
    listOfMafiaPlayers = [];
  }

  function add(id) {
    if (listOfPlayers.includes(id)) {
      throw "Already exists";
    }
    listOfPlayers.push(id);
    listOfAlivePlayers.push(id);
  }

  function kill(id) {
    const index = listOfAlivePlayers.indexOf(id);
    if (index < 0) {
      throw "Not found";
    }

    listOfAlivePlayers.splice(index, 1);
  }

  function assignRole(id, role) {
    if (!listOfPlayers.includes(id)) {
      throw "Not Found";
    }

    switch (role) {
      case "MAFIA":
        listOfMafiaPlayers.push(id);
        return;
      default:
        throw "Role not implemented";
    }
  }

  function getAllPlayers() {
    return listOfPlayers;
  }

  function getAlivePlayers() {
    return listOfAlivePlayers;
  }

  function getMafiaPlayers() {
    return listOfMafiaPlayers;
  }

  function getAliveMafiaPlayers() {
    return listOfMafiaPlayers.filter((playerId) =>
      listOfAlivePlayers.includes(playerId)
    );
  }

  function getAliveNonMafiaPlayers() {
    return listOfAlivePlayers.filter(
      (playerId) => !listOfMafiaPlayers.includes(playerId)
    );
  }

  return {
    reset: reset,
    add: add,
    kill: kill,
    assignRole: assignRole,
    getAllPlayers: getAllPlayers,
    getAlivePlayers: getAlivePlayers,
    getMafiaPlayers: getMafiaPlayers,
    getAliveMafiaPlayers: getAliveMafiaPlayers,
    getAliveNonMafiaPlayers: getAliveNonMafiaPlayers,
  };
}

module.exports = playerApi();
