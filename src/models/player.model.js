function playerApi() {
  // Currently using lists for data layer
  var listOfPlayers = [];
  var listOfAlivePlayers = [];
  var listOfMafiaPlayers = [];
  var detectivePlayer = null;
  var doctorPlayer = null;

  function reset() {
    listOfPlayers = [];
    listOfAlivePlayers = [];
    listOfMafiaPlayers = [];
    detectivePlayer = null;
    doctorPlayer = null;
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
      case "DETECTIVE":
        detectivePlayer = id;
      case "DOCTOR":
        doctorPlayer = id;
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

  function getAliveDetectivePlayers() {
    return listOfAlivePlayers.find((playerId) => playerId === detectivePlayer);
  }

  function getAliveDoctorPlayers() {
    return listOfAlivePlayers.find((playerId) => playerId === doctorPlayer);
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
    getAliveDetectivePlayers: getAliveDetectivePlayers,
    getAliveDoctorPlayers: getAliveDoctorPlayers,
  };
}

module.exports = playerApi();
