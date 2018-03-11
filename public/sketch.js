var socket;
var trackWidth = 800;   // = 16 Zeilen
var trackHeight = 600;  // = 12 Spalten
var blockSize = 50;
var imgs = [];
var imgscar = [];
var imgsothercars = [];
var name;
var tempPlayerStates;
var track = [];

function preload() {
  // img = loadImage('img/car1.png');
  for(var i = 0; i < 8; i++){
    imgscar.push(loadImage("img/owncar/car"+i+".png")); // 0-7 --> My Cars
  }
  for(var i = 0; i < 8; i++){
    imgsothercars.push(loadImage("img/othercar/car"+i+".png")); // 0-7 --> Other Player Cars
  }
  imgs.push(loadImage("img/track.png"));      // 0 --> Track
  imgs.push(loadImage("img/border.png"));     // 1 --> Border
  imgs.push(loadImage("img/startline.png"));  // 2 --> Startline
  imgs.push(loadImage("img/endline.png"));    // 3 --> Endline
}

function setup() {
  createCanvas(trackWidth,trackHeight);
  socket = io.connect('http://localhost:3000');

  // read name from URL
  name = getNameFromURL();

  // trigger update (don't register)
  socket.emit('trigger_update', name);

  // register socket.io listeners
  socket.on('update', update);
  socket.on('position_validity_res', colorizedField);
}

function getNameFromURL() {
  var pathArray = window.location.pathname.split( '/' );
  return pathArray[pathArray.length-1];
}

function update(gameState) {
  console.log(gameState.message);
  track = gameState.track;
  tempPlayerStates = gameState.players; // needed for checking valid fields
  drawBackground();
  drawCars(gameState.players);
}

function drawCars(players) {
  players.forEach( (p) => {
    var velox = p.vx;
    var veloy = p.vy;
    var pictureNumber;
    if(velox >= 0 && veloy == 0){          // 0°
      pictureNumber = 0;
    } else if (velox > 0 && veloy < 0) {  // 0 - 90°
      pictureNumber = 1;
    } else if (velox == 0 && veloy < 0) { // 90°
      pictureNumber = 2;
    } else if (velox < 0 && veloy < 0) {  // 90 - 180°
      pictureNumber = 3;
    } else if (velox < 0 && veloy == 0) {  // 180°
      pictureNumber = 4;
    } else if (velox < 0 && veloy > 0) {   // 180 - 270°
      pictureNumber = 5;
    } else if (velox == 0 && veloy > 0) {   // 270°
      pictureNumber = 6;
    } else if (velox > 0 && veloy > 0) {    // 270 - 360°
      pictureNumber = 7;
    }
    if(p.name == name){
      image(imgscar[pictureNumber],p.px*blockSize, p.py*blockSize);
    } else {
      image(imgsothercars[pictureNumber],p.px*blockSize, p.py*blockSize);
    }
  });
}

function drawBackground() {
    var styleMap = {
        0: '0', // race floor   #e5e5e5
        1: '1', // border/wall  #c6c6c6
        2: '2', // start line   #e0ffe7
        3: '3'  // finish line  #ffe0e0
    }

    function draw(cal, row, t) {
      // fill(color(styleMap[t]));
      // rect(x*blockSize, y*blockSize, blockSize, blockSize);
      image(imgs[styleMap[t]],cal*blockSize, row*blockSize, blockSize, blockSize);
    }

    if(track.length == 0) {
      return;
    }

    for(var row = 0; row < track.length; row++) {
      for(var col = 0; col < track[0].length; col++) {
        draw(col, row, track[row][col]);
      }
    }
}


function mouseClicked() {
  sendPlayerActionToServer('move_car_req');
}


function mouseMoved() {
  sendPlayerActionToServer('position_validity_req');
}


function sendPlayerActionToServer(adr) {
  var data = {
    name: name,
    col: floor(mouseX/blockSize),
    row: floor(mouseY/blockSize)
  }

  if (overflowWidth(data.col) || overflowHeight(data.row)) {
    return;
  } else {
    socket.emit(adr, data);
  }
}


function overflowHeight(pos) {
  return pos >= track.length || pos < 0;
}

function overflowWidth(pos) {
  if (track.length > 0){
    return pos >= track[0].length || pos < 0;
  } else {
    return false;
  }
}

function colorizedField(data) {
  drawBackground();
  drawCars(tempPlayerStates);

  if(data.valid){
    fill(color('#00ff00'));
  } else{
    fill(color('#ff0000'));
  }
  rect(data.col*blockSize, data.row*blockSize, blockSize, blockSize);
}
