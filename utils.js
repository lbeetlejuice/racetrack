module.exports = {
  randint: function (min, max) {
    // https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range#1527820
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  randomlyChooseArrayElement: function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },
  initializeGameState: function(track) {
    return {
      track: track,
      players: []
    }
  }
}
