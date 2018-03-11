// 0 = road
// 2 = start line
// 3 = end line
var defaultTrack = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                   [1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
                   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                   [1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1],
                   [1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1],
                   [1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1],
                   [1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1],
                   [1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1],
                   [1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1],
                   [1,0,0,0,0,0,0,3,2,0,0,0,0,0,0,1],
                   [1,1,0,0,0,0,0,3,2,0,0,0,0,0,1,1],
                   [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];


module.exports = {
  getDefaultTrack: function() {
    return defaultTrack
  },
  getStartLineCoordinates: function(track) {
    var coords = []
    for (var row = 0; row < track.length; row++) {
      for (var col = 0; col < track[0].length; col++) {
        if (track[row][col] == 2) {
          coords.push([row, col]);
        }
      }
    }
    return coords;
  }
};

