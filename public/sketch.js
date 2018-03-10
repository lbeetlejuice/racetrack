var socket;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(51);

	socket = io.connect('http://localhost:3000');

	socket.on('mouse', newDrawing);

	socket.emit('i_am_ready');

	socket.on('init', (ds) => {
		ds.forEach( (d) => {
			noStroke();
			fill(255);
			ellipse(d.x,d.y,20,20);
		});
	});
}

function newDrawing(data){
	noStroke();
	fill(255,0,100);
	ellipse(data.x,data.y,20,20);
}

function mouseDragged(){
	console.log('Sending: ' +mouseX + ', '+mouseY);

	var data = {
		x: mouseX,
		y: mouseY
	}
	socket.emit('mouse', data);

	noStroke();
	fill(255);
	ellipse(mouseX,mouseY,20,20);
}
