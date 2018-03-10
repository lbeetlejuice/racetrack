var socket;
var trackWidth = 800;   // = 16 Zeilen
var trackHeight = 600;  // = 12 Spalten
var blockSize = 50;
var imgs = [];
var name;

var track = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
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
  console.log(gameState.message);

  drawBackground();
  gameState.players.forEach( (p) => {
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

    function draw(x,y,t) {
      fill(color(styleMap[t]));
      rect(x*blockSize, y*blockSize, blockSize, blockSize);
    }

    for(var row=0; row < trackHeight/blockSize; row++) {
      for(var col=0; col < trackWidth/blockSize; col++) {
        draw(col, row, track[row][col]);
      }
    }
}

function mouseMoved(){
  var data = {
    name: name,
    x: floor(mouseX/blockSize),
    y: floor(mouseY/blockSize)
  }
  socket.emit('position_validity_req', data);
}

function colorizedField(data) {
  if(data.valid){
    fill(color('#00ff00'));
    rect(data.x*blockSize, data.y*blockSize, blockSize, blockSize);
  } else{
    fill(color('#ff0000'));
    rect(data.x*blockSize, data.y*blockSize, blockSize, blockSize);
  }
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
