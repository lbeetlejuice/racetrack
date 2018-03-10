module.exports = {
  randint: function (min, max) {
    // https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range#1527820
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  bar: function () {
    // whatever
  }
};
