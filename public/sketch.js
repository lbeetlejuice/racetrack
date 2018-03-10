var socket;
var trackWidth = 800;   // = 16 Zeilen
var trackHeight = 600;  // = 12 Spalten
var blockSize = 50;
var cvn;
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
  cvn = createCanvas(trackWidth,trackHeight);
  socket = io.connect('http://localhost:3000');
  socket.on('mouse', newDrawing);
  socket.emit('i_am_ready');
  socket.on('init', (ds) => {
    drawBackground();
  });
  message();
}

function newDrawing(data){
  // noStroke();
  // fill(255,0,100);
  // ellipse(data.x,data.y,20,20);
}

function mouseDragged(){
  console.log('Sending: ' +mouseX + ', '+mouseY);

  var data = {
    x: mouseX,
    y: mouseY
  }
  socket.emit('mouse', data);

  var my = mouseY;
  var mx = mouseX;
  var aktField = []
  // noStroke();
  // fill(255);
  // ellipse(mouseX,mouseY,20,20);
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
  console.log(name);
}
