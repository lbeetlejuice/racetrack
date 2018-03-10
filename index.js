var express = require('express');
var app = express();
var server = app.listen(3000);
var utils = require("./utils");
app.use(express.static('public'));

var socket = require('socket.io');
var io = socket(server);
io.sockets.on('connection', newConnection);


// global data structure
var all_data = [];
var players = [];

function newConnection(socket){
  // console.log('new connection: '+socket.id);

  socket.on('i_am_ready', () => {
    socket.emit('init', all_data);
  });

  socket.on('mouse', mouseMsg);

  function mouseMsg(data){
    all_data.push(data);
    socket.broadcast.emit('mouse', data);
    console.log(data);
  }
}


function newPlayer(name) {
  players.push({
    x: utils.randint(0,10),
    y: utils.randint(0,10),
    name: name
  });
}


function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
