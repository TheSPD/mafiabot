function player() {
  return {
    create: create,
  };
}

function create(models) {
  function add(id) {
    models.player.add(id);
  }

  function kill(id) {
    models.player.kill(id);
  }

  function assignRole(id, role) {
    models.player.assignRole(id, role);
  }

  function getMentionFromId(id) {
    return `@${id.split("@")[0]}`;
  }

  function getAllPlayers() {
    return models.player.getAllPlayers();
  }

  function getAliveNonMafiaPlayers() {
    return models.player.getAliveNonMafiaPlayers();
  }

  function getAlivePlayers() {
    return models.player.getAlivePlayers();
  }

  function getAliveMafiaPlayers() {
    return models.player.getAliveMafiaPlayers();
  }

  return {
    add: add,
    kill: kill,
    assignRole: assignRole,
    getAllPlayers: getAllPlayers,
    getAliveNonMafiaPlayers: getAliveNonMafiaPlayers,
    getAlivePlayers: getAlivePlayers,
    getAliveMafiaPlayers: getAliveMafiaPlayers,
  };
}

module.exports = player();
