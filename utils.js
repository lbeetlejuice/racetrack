
// checks whether the position at col/row would be valid for car owner <name>
// if name cannot be found within <gameState.players>, false is returned.
function posValidityCheck(name, col, row, gameState) {
  // readability
  var maxWidth = gameState.track[0].length;
  var maxHeight = gameState.track.length;
  
  player = findPlayer(name, gameState);
  
  // error handling
  if (!player.found) return false;
  if (col < 0 || row < 0 || row >= maxHeight || col >= maxWidth) return false;
  if (gameState.track[row][col] != 0) return false;
  

  var foundValidField = false;
  vfs = getValidFields(player.player)
  vfs.forEach( (vf) => {
    var validRow = vf[0];
    var validCol = vf[1];

    if (row == validRow && col == validCol) {
      foundValidField = true;
    }
  });

  return foundValidField;
}


// parameter: the actual player object, as it is saved in gameState.players
function getValidFields(player) {
  var col = player.px + player.vx;
  var row = player.py + player.vy;

  return [
    [row, col],
    [row+1, col],
    [row-1, col],
    [row, col+1],
    [row+1, col+1],
    [row-1, col+1],
    [row, col-1],
    [row+1, col-1],
    [row-1, col-1]
  ]
}


var findPlayer = function(name, gameState) {
  res = { 
    found: false
  };  
  gameState.players.forEach( (p) => {
    if (p.name === name) {
      res.found = true;
      res.player = p;
    } 
  });
  return res;
} 


// updates position and velocity based on new position
// does not check validity of new position
var getUpdatedPlayer = function(player, newPx, newPy) {
  player.vx = newPx - player.px;
  player.vy = newPy - player.py;

  player.px = newPx;
  player.py = newPy;

  return player;
}


var randint = function(min, max) {
    // https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range#1527820
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


var randomlyChooseArrayElement = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}


var initializeGameState = function(track) {
    return {
      track: track,
      players: []
    }
}


var updateCarPosition = function(name, px, py, gameState) {
    var foundPlayer = findPlayer(name, gameState);
    if (foundPlayer.found) {
      for(var i = 0; i < gameState.players.length; i++) {
        if (gameState.players[i].name === name) { // updating values in p of players
          gameState.players[i] = getUpdatedPlayer(gameState.players[i], px, py);
          break;
        }
      }
    }
    return gameState;
}


module.exports = {

  // provides a random integer between min and max
  randint: randint,
  
  // chooses a random element from the array passed
  randomlyChooseArrayElement: randomlyChooseArrayElement,
  
  // when passing a track, this function returns a gameState object
  initializeGameState: initializeGameState,   
  
  // finds a player in a gameState object based on a player name
  // returns an object {found: boolean, player: <player-object>}
  findPlayer: findPlayer,
  
  // moves a car to a new position and updates vx/vy as well
  // does not check for validity of the request!
  updateCarPosition: updateCarPosition,

  // returns a boolean indicating whether the requesting <col>/<row> is feasible for
  // <name> in the current <gameState>
  posValidityCheck: posValidityCheck,

  // returns an 9x1 array of [row, col] tuples
  getValidFields: getValidFields
}

