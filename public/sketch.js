var socket;
var trackWidth = 800;   // = 16 Zeilen
var trackHeight = 600;  // = 12 Spalten
var blockSize = 50;
var imgs = [];
var name;
var tempPlayerStates;
var track = [];

function preload() {
  // img = loadImage('img/car1.png');
  for(var i = 1; i < 6; i++){
    imgs.push(loadImage("img/car"+i+".png"));
  }
  imgs.push(loadImage("img/track.png"));  //5
  imgs.push(loadImage("img/border.png")); //6
  imgs.push(loadImage("img/startline.png")); //7
  imgs.push(loadImage("img/endline.png"));   //8
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
  console.log(players);
  players.forEach( (p) => {
    if(p.name == name){
      image(imgs[1],p.px*blockSize, p.py*blockSize);
    } else {
      image(imgs[0],p.px*blockSize, p.py*blockSize);
    }
  });
}

function drawBackground() {
    var styleMap = {
        0: '5', // race floor   #e5e5e5
        1: '6', // border/wall  #c6c6c6
        2: '7', // start line   #e0ffe7
        3: '8'  // finish line  #ffe0e0
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

function mouseMoved() {
  var data = {
    name: name,
    col: floor(mouseX/blockSize),
    row: floor(mouseY/blockSize)
  }

  if (overflowWidth(data.col) || overflowHeight(data.row)) {
    return;
  } else {
    socket.emit('position_validity_req', data);
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

  console.log(data);

  if(data.valid){
    fill(color('#00ff00'));
  } else{
    fill(color('#ff0000'));
  }
  rect(data.col*blockSize, data.row*blockSize, blockSize, blockSize);
}

