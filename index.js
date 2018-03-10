var express = require('express');
var app = express();
var server = app.listen(3000);
var utils = require("./utils");
app.use(express.static('public'));

var socket = require('socket.io');
var io = socket(server);
io.sockets.on('connection', newConnection);


// global data structure
var gameState = {
  players: []
};


function newConnection(socket){
  socket.on('register_request', (name) => {
    gameState.players.push(newPlayer(name));
    emitUpdate(socket, "A new player registered: " + name + ". Current number of players: " + gameState.players.length);
  });

  socket.on('mouse', (data) => {
    // socket.broadcast.emit('mouse', data);
    console.log(data);

    emitUpdate(socket, data.name + " dragged his mouse!");
  });

  socket.on('position_validity_req', (data) => {
    socket.emit('position_validity_res', {
      name: data.name,
      x: data.x,
      y: data.y,
      valid = posValidityCheck(data)
    });   
  });
}


function emitUpdate(socket, message) {
  gameState.message = message;
  socket.emit('update', gameState);
  socket.broadcast.emit('update', gameState);
}


function newPlayer(name) {
  return {
    name: name,
    px: utils.randint(0,10),
    py: utils.randint(0,10),
    vx: utils.randint(0,10),
    vy: utils.randint(0,10)
  };
}


function posValidityCheck(suggestion) {
  return Math.random() >= 0.5
}


