var checkAndUpdatePlayerState = function(name, gameState) {
  var t = gameState.track;

  var foundPlayer = findPlayer(name, gameState);
  if (foundPlayer.found) {
    var p = foundPlayer.player;
    
    // check if player hit the target line
    if (t[p.py][p.px] == 3) {
      return {
        state: "finished",
        gameState: updatePlayerState(name, "finished", gameState)     
      }
    }

    // check if no valid fields are left
    var validFields = getValidFields(p);
    var foundValidField = false;
    validFields.forEach( (pos) => {
      var isValid = posValidityCheck(name, pos[1], pos[0], gameState);
      if (isValid) {
        foundValidField = true;
      }
    });

    if (foundValidField) {
      return {
        state: "playing",
        gameState: gameState // no need for change
      }
    } else {
      return {
        state: "killed",
        gameState: updatePlayerState(name, "killed", gameState)
      }
    }
  } // else --> error
}


// helpers for updatePlayerState
// todo: refactor (code duplication)
var updatePlayerState = function(name, newState, gameState) {
    var foundPlayer = findPlayer(name, gameState);
    if (foundPlayer.found) {
      for(var i = 0; i < gameState.players.length; i++) {
        if (gameState.players[i].name === name) { // updating values in p of players
          gameState.players[i] = changeOnePlayerState(gameState.players[i], newState);
          break;
        }
      }
    }
    return gameState;
}


// helpers for updatePlayerState
var changeOnePlayerState = function(player, newState) {
  player.state = newState;
  return player;
}


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
  if (gameState.track[row][col] == 1) return false;
  

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
  // checks whether the player cannot move anymore (will crashs = killed)
  // or whether the player hit the target line
  checkAndUpdatePlayerState: checkAndUpdatePlayerState,

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

