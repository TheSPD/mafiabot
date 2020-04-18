game = require("./game.model");
voting = require("./voting.model");
player = require("./player.model");

function models() {
  return {
    game: game,
    player: player,
    voting: voting,
  };
}

module.exports = models();
