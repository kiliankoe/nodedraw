
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

// Enable socket.io
var server = http.createServer(app).listen( app.get('port') );
var io = require ('socket.io').listen(server, function() {
	console.log("Express server listening on port " + app.get('port'));
});

// socket.io magic
io.sockets.on('connection', function (socket){
	// socket.on('drawCircle', function(data,session) {
	// 	socket.broadcast.emit('drawCircle',data);
	// });

	socket.on('drawPathDown', function(data,session) {
		socket.broadcast.emit('drawPathDown',data);
	});

	socket.on('drawPathDrag', function(data,session) {
		socket.broadcast.emit('drawPathDrag',data);
	});

	socket.on('drawPathUp', function(data,session){
		socket.broadcast.emit('drawPathUp',data);
	});
});
