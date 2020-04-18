const models = require("./models/models");
const services = require("./services/services");

const app = services.create(models);

module.exports = app;
