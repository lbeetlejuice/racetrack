var socket;
var trackWidth = 800;   // = 16 Zeilen
var trackHeight = 600;  // = 12 Spalten
var blockSize = 50;
var imgs = [];
var name;
var tempPlayerStates;
var track = [];

function setup() {
  createCanvas(trackWidth,trackHeight);
  socket = io.connect('http://localhost:3000');
  name = message();
  socket.emit('register_request', name);

  // register for events
  socket.on('update', update);
  for(var i = 1; i < 6; i++){
    imgs.push(loadImage("img/car"+i+".png"));
  }
  socket.on('position_validity_res', colorizedField);
}

function update(gameState) {
  track = gameState.track;
  console.log(gameState.message);
  drawBackground();
  tempPlayerStates = gameState.players;
  drawCars(gameState.players);
}

function drawCars(players) {
  players.forEach( (p) => {
  console.log(p);
  image(imgs[1],p.px*blockSize, p.py*blockSize);
  });
}


function drawBackground() {
    var styleMap = {
        0: '#e5e5e5', // race floor
        1: '#c6c6c6', // border/wall
        2: '#e0ffe7', // start line
        3: '#ffe0e0'  // finish line
    }

    function draw(x, y, t) {
      fill(color(styleMap[t]));
      rect(x*blockSize, y*blockSize, blockSize, blockSize);
    }

    if(track.length == 0) {
      return;
    }

    for(var row = 0; row <= track.length; row++) {
      for(var col = 0; col <= track[0].length; col++) {
        draw(col, row, track[row][col]);
      }
    }
}

function mouseMoved() {
  var aktposX;
  var data = {
    name: name,
    col: overflow(mouseX),
    row: overflow(mouseY)
  }
  socket.emit('position_validity_req', data);
}

function overflow(pos) {
  if(pos > trackWidth) {
    pos = trackWidth -1;
  } elseif(pos > trackHeight) {
    pos = trackHeight -1;
  } else {
    pos = floor(pos/blockSize);
  }
  return pos;
}

function colorizedField(data) {
  drawBackground();
  drawCars(tempPlayerStates);

  if(data.valid){
    fill(color('#00ff00'));
  } else{
    fill(color('#ff0000'));
  }
  rect(data.x*blockSize, data.y*blockSize, blockSize, blockSize);
}

function message() {
  var name = "";
  var person = prompt("Please enter your name");
  if (person == null || person == "") {
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)
      name += possible.charAt(Math.floor(Math.random() * possible.length));
  } else {
    name = person;
  }
  return name;
}
