tool.maxDistance = 100;

function randomColor() {
	return {
		red: 0,
		green: Math.random(),
		blue: Math.random(),
		alpha: (Math.random() * 0.25) + 0.05
	};
}

var darkgrey = {
		red: 0.1,
		green: 0.1,
		blue: 0.1,
		alpha: 0.9
};

function onMouseDown(e) {
	var point = e.point;
	drawPathDown(point);
	emitPathDown(point);
}

function drawPathDown(point){
	console.log(point);
	path = new Path();
	path.fillColor = darkgrey;
	path.add(point);
	view.draw();
}

function onMouseDrag(e) {
	var step = e.delta / 2;
	step.angle += 10;
	var top = e.middlePoint + step;
	var bottom = e.middlePoint - step;

	drawPathDrag(top,bottom);
	emitPathDrag(top,bottom);
}

function drawPathDrag(top,bottom) {
	console.log(top,bottom);
	path.add(top);
	path.insert(0,bottom);
	path.smooth();
	view.draw();
}

function onMouseUp(e) {
	var point = e.point;
	drawPathUp(point);
	emitPathUp(point);
}

function drawPathUp(point) {
	console.log(point);
	path.add(point);
	path.closed = true;
	path.smooth();
	view.draw();
}




function emitPathDown(point) {
	var sessionId = io.socket.sessionid;
	var data = {
		point: point
	};
	io.emit('drawPathDown', data, sessionId);
}

function emitPathDrag(top,bottom) {
	var sessionId = io.socket.sessionid;
	var data = {
		top: top,
		bottom: bottom
	};
	io.emit('drawPathDrag', data, sessionId);
}

function emitPathUp(point) {
	var sessionId = io.socket.sessionid;
	var data = {
		point: point
	};
	io.emit('drawPathUp', data, sessionId);
}


io = io.connect('/');

io.on('drawPathDown', function(data){
	var json = {
		point: data.point
	};
	drawPathDown(json.point);
});

io.on('drawPathDrag', function(data){
	drawPathDrag(data.top,data.bottom);
});

io.on('drawPathUp', function(data){
	drawPathUp(data.point);
});
