function gameApi() {
  // Currently using lists for data layer
  const TimeOfDay = { DAY: 1, NIGHT: 2 };
  Object.freeze(TimeOfDay);
  var timeOfDay = null;
  var started = false;
  var groupId = null;
  var mafiaGroupId = null;

  function reset() {
    timeOfDay = null;
    started = false;
    groupId = null;
    mafiaGroupId = null;
  }

  function start() {
    started = true;
  }

  function end() {
    started = false;
  }

  function isStarted() {
    return started;
  }

  function setDay() {
    timeOfDay = TimeOfDay.DAY;
  }

  function setNight() {
    timeOfDay = TimeOfDay.NIGHT;
  }

  function isDay() {
    return timeOfDay === TimeOfDay.DAY;
  }

  function isNight() {
    return timeOfDay === TimeOfDay.NIGHT;
  }

  function setGroup(id) {
    groupId = id;
  }

  function getGroup() {
    return groupId;
  }

  function setMafiaGroup(id) {
    mafiaGroupId = id;
  }

  function getMafiaGroup(id) {
    return mafiaGroupId;
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  return {
    reset: reset,
    start: start,
    end: end,
    isStarted: isStarted,
    setDay: setDay,
    setNight: setNight,
    isDay: isDay,
    isNight: isNight,
    setGroup: setGroup,
    getGroup: getGroup,
    setMafiaGroup: setMafiaGroup,
    getMafiaGroup: getMafiaGroup,
    sleep: sleep,
  };
}

module.exports = gameApi();
