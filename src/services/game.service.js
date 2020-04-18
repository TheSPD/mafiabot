_ = require("lodash");

function game() {
  return {
    create: create,
  };
}

function create(models) {
  const MIN_SIZE = 4;
  function start() {
    if (models.game.isStarted()) {
      throw "Game is already started";
    }

    if (models.player.getAllPlayers().length < MIN_SIZE) {
      throw "Need more players";
    }

    started = true;
    models.game.setNight();
  }

  function assignMafias() {
    allPlayers = models.player.getAllPlayers();
    numOfMafias = Math.floor(allPlayers.length / 3);
    mafiaPlayers = _.sampleSize(allPlayers, numOfMafias);
    mafiaPlayers.forEach((mafiaPlayer) => {
      models.player.assignRole(mafiaPlayer, "MAFIA");
    });
    console.log(models.player.getAliveMafiaPlayers());

    return mafiaPlayers;
  }

  function linkGroup(id) {
    if (models.game.getGroup() !== id) {
      reset();
    }

    models.game.setGroup(id);
  }

  function reset() {
    models.game.reset();
    models.player.reset();
    models.voting.reset();
  }

  function linkMafiaGroup(id) {
    if (models.game.getMafiaGroup() !== id) {
    }
    models.game.setMafiaGroup(id);
  }

  function isLinkedGroup(id) {
    return id === models.game.getGroup();
  }

  function isMafiaGroup(id) {
    return id === models.game.getMafiaGroup();
  }

  function getMafiaGroup() {
    return models.game.getMafiaGroup();
  }

  function getGroup() {
    return models.game.getGroup();
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function setNight() {
    models.game.setNight();
  }

  function setDay() {
    models.game.setDay();
  }

  function murder(murderedId) {
    models.player.kill(murderedId);
  }

  function status() {
    alivePlayers = models.player.getAlivePlayers();
    mafiaPlayers = models.player.getAliveMafiaPlayers();
    nonMafiaPlayers = models.player.getAliveNonMafiaPlayers();

    console.log({
      isStarted: models.game.isStarted(),
      isDay: models.game.isDay(),
      isNight: models.game.isNight(),
      alivePlayers: alivePlayers,
      villagersWon: mafiaPlayers.length === 0,
      mafiaWon: mafiaPlayers.length >= nonMafiaPlayers.length,
    });

    return {
      isStarted: models.game.isStarted(),
      isDay: models.game.isDay(),
      isNight: models.game.isNight(),
      alivePlayers: alivePlayers,
      villagersWon: mafiaPlayers.length === 0,
      mafiaWon: mafiaPlayers.length >= nonMafiaPlayers.length,
    };
  }

  return {
    start: start,
    assignMafias: assignMafias,
    linkGroup: linkGroup,
    linkMafiaGroup: linkMafiaGroup,
    isLinkedGroup: isLinkedGroup,
    isMafiaGroup: isMafiaGroup,
    sleep: sleep,
    getMafiaGroup: getMafiaGroup,
    getGroup: getGroup,
    setNight: setNight,
    setDay: setDay,
    murder: murder,
    status: status,
    reset: reset,
  };
}

module.exports = game();
