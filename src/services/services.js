game = require("./game.service");
voting = require("./voting.service");
player = require("./player.service");

function create(models) {
  return {
    game: game.create(models),
    player: player.create(models),
    voting: voting.create(models),
  };
}

function services() {
  return {
    create: create,
  };
}

module.exports = services();
