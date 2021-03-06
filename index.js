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

  // anyone can trigger an update. no state change occurs.
  socket.on('trigger_update', (name) => {
    console.log("update triggered by " + name);
    emitUpdate(socket, "Update triggered by " + name);
  });

  // when moving the mouse over the field, the client may requests for field validity
  // to colorize whether the car can move there or not.
  // no state change occurs.
  socket.on('position_validity_req', (data) => {
    socket.emit('position_validity_res', {
      name: data.name,
      row: data.row,
      col: data.col,
      valid: utils.posValidityCheck(data.name, data.col, data.row, gameState)
    });
  });

  // if the request turns out to be valid, the game state is changed and the car is moved.
  socket.on('move_car_req', (data) => {
    var isValid = utils.posValidityCheck(data.name, data.col, data.row, gameState);
    var message = "Invalid move request by " + data.name;

    if (isValid) {
      gameState = utils.updateCarPosition(data.name, data.col, data.row, gameState);
      
      // after moving the car to a valid position, check if the player state is 
      // equal to "finished" or "killed" and update if so.
      var updatedState = utils.checkAndUpdatePlayerState(data.name, gameState);
      gameState = updatedState.gameState;
      
      if (updatedState.state === "killed" || updatedState.state === "finished") {
        message = "Player " + data.name + " " + updatedState.state;
      } else {
        message = "Player " + data.name + " moved car!";
      }
    }
    
    emitUpdate(socket, message);
  });
}


// general helper function to inform everyone about an update
function emitUpdate(socket, message) {
  gameState.message = message;
  socket.emit('update', gameState);
  socket.broadcast.emit('update', gameState);
}


// helper: adds a new player to the game state
function newPlayer(name) {
  var coords = maps.getStartLineCoordinates(gameState.track);
  var startCoords = utils.randomlyChooseArrayElement(coords);
  return {
    name: name,
    state: "playing",
    px: startCoords[1],
    py: startCoords[0],
    vx: 0,
    vy: 0
  };
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


