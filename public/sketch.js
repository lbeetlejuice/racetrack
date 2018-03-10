var socket;
var trackWidth = 800;
var trackHeight = 600;
var blockSize = 50;

var names = ["Uzochi Kayode", "Tafari Nkechinyere", "Akinyi Abeba", "Chibuzo Awiti", "Eniola Zephania", "Jelani Itumeleng"];
var name = chooseRandom(names);


// helper function to choose one out of many (array)
function chooseRandom(myArray) {
  return myArray[Math.floor(Math.random() * myArray.length)];
}

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
    // the client says that he's ready and would like to register for a race competition
	socket.emit('register_request', name);

    // register for events	
    // socket.on('mouse', newDrawing);
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


function newDrawing(data){
	noStroke();
	fill(255,0,100);
	ellipse(data.x,data.y,20,20);
}

function mouseDragged(){
	// console.log('Sending: ' +mouseX + ', '+mouseY);

	var data = {
        name: name,
		x: mouseX,
		y: mouseY
	}
	socket.emit('mouse', data);

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
          // ctx.strokeRect(x*blockSize, y*blockSize, blockSize, blockSize);
    }

    for(var row=0; row < trackHeight/blockSize; row++) {
      for(var col=0; col < trackWidth/blockSize; col++) {
        draw(row, col, track[row][col]);
      }
    }
}
