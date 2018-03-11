var express = require('express');
var app = express();
var server = app.listen(3000);
var utils = require("./utils");
var maps = require("./maps");
app.use("/", express.static('public'));

var socket = require('socket.io');
var io = socket(server);
io.sockets.on('connection', newConnection);


// global data structure
var gameState = utils.initializeGameState(maps.getDefaultTrack());
var isReset = false;


function newConnection(socket) {

  // 2 possible answers on register request:
  // - if player name is present, no new player is added, i.e. it is assumed that an existing player has reconnected
  // - if no player with that name is present, a new player is added to the game
  socket.on('register_request', (name) => {
    console.log("register request by " + name);
    var foundPlayer = utils.findPlayer(name, gameState);

    if (!foundPlayer.found) {
      gameState.players.push(newPlayer(name));
    }

    // make response to request client
    socket.emit('register_response', {
      message: "player added"
    });
    
    // inform all
    emitUpdate(socket, "A new player registered: " + name + ". Current number of players: " + gameState.players.length);
  });

  socket.on('trigger_update', (name) => {
    console.log("update triggered by " + name);
    emitUpdate(socket, "Update triggered by " + name);
  });

  socket.on('mouse', (data) => {
    // socket.broadcast.emit('mouse', data);
    console.log(data);

    emitUpdate(socket, data.name + " dragged his mouse!");
  });

  socket.on('position_validity_req', (data) => {
    socket.emit('position_validity_res', {
      name: data.name,
      row: data.row,
      col: data.col,
      valid: posValidityCheck(data.name, data.col, data.row)
    });
  });
}


function emitUpdate(socket, message) {
  gameState.message = message;
  socket.emit('update', gameState);
  socket.broadcast.emit('update', gameState);
}


function newPlayer(name) {
  var coords = maps.getStartLineCoordinates(gameState.track);
  var startCoords = utils.randomlyChooseArrayElement(coords);

  console.log(coords);

  return {
    name: name,
    px: startCoords[1],
    py: startCoords[0],
    vx: 0,
    vy: 0
  };
}


// checks whether the position at col/row would be valid for car owner <name>
// if name cannot be found within <gameState.players>, false is returned.
function posValidityCheck(name, col, row) {
  // readability
  var maxWidth = gameState.track[0].length;
  var maxHeight = gameState.track.length;
  
  player = utils.findPlayer(name, gameState);
  
  // error handling
  if (!player.found) return false;
  if (col < 0 || row < 0 || row >= maxHeight || col >= maxWidth) return false;
  if (gameState.track[row][col] != 0) return false;
  

  var foundValidField = false;
  vfs = getValidFields(player.row, player.col)
  vfs.forEach( (vf) => {
    var validRow = vf[0];
    var validCol = vf[1];

    if (row == validRow && col == validCol) {
      foundValidField = true;
    }
  });

  return foundValidField;
}


function getValidFields(row, col) {
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


app.get('/', function (req, res) {
  res.send("register here ... ");
});



// other controllings
app.get('/reset', function (req, res) {
  gameState = utils.initializeGameState(maps.getDefaultTrack());
  isReset = true;
  res.send("Game has been resetted!");
});


app.get('/:name', function (req, res) {
  // res.send("your name: " + req.params.name);
  res.sendFile(__dirname + "/public/game.html");
});


