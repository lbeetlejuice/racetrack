var socket;
var trackWidth = 800;   // = 16 Zeilen
var trackHeight = 600;  // = 12 Spalten
var blockSize = 50;

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
}

function update(gameState) {
  console.log(gameState.message);

  drawBackground();
  gameState.players.forEach( (p) => {
  console.log(p);
    // @Luki, draw the car images here
  });
}

function mouseDragged(){
	var data = {
    name: name,
		x: mouseX,
		y: mouseY
	}
  
	socket.emit('mouse', data);

  // #Luki WIP
  var my = mouseY;
  var mx = mouseX;
  var aktField = []
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
  return name;
}
