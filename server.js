
var express = require('express');
var app = express();
var server = app.listen(3000);

app.use(express.static('public'));

console.log("Socket server is running");

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

var all_data = [];

function newConnection(socket){
  // console.log('new connection: '+socket.id);

  console.log(all_data);

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
