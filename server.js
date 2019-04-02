var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
var newRoom = "1";
var rooms = io.sockets.adapter.rooms;
// handle incoming connections from clients
io.sockets.on('connection', function(socket) {
  socket.on('create-room', function() {
    createRoom(socket);
  });
  socket.on('join-room', function(room) {
    joinRoom(socket, room);
  });
});

function createRoom(socket) {
  socket.join(newRoom);
  console.log(newRoom);
  var roomInt = parseInt(newRoom);
  newRoom = `${roomInt}`;
  roomInt += 1;
  console.log("Created a Room");
};

function joinRoom(socket, room) {
  socket.join(room);
  console.log("Joined a Room");
};



var port = process.env.PORT || 3000;

http.listen(port, function(){
  console.log('listening on *:3000');
});