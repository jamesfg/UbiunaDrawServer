var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


var rooms = io.sockets.adapter.rooms;

var roomInfo = [];

// handle incoming connections from clients
io.sockets.on('connection', function(socket) {
  
  socket.on('disconnect', function(){
    disconnectFromRoom(socket);
  });

  socket.on('create-room', function() {
    createRoom(socket);
  });
  
  socket.on('join-room', function(room) {
    if(rooms[room]) {
      joinRoom(socket, room);
    } else {
      socket.emit('join-room-error', `Canvas code ${room} is invalid`)
    }
  });

  socket.on('from-socket-update-room', function(roomInfoFromSocket) {
    var foundRoomIndex = roomInfo.findIndex(room => room.room === roomInfoFromSocket.room);
    roomInfo[foundRoomIndex] = roomInfoFromSocket;
    io.to(roomInfoFromSocket.room).emit('update-room', roomInfoFromSocket);
  });
});



function createRoom(socket, username) {
  var newRoom = `${Math.floor((Math.random() * 9999) + 999)}`;
  if(rooms[newRoom]) {
    this.createRoom(socket);
  } else {
    socket.join(newRoom);
    currentRoom = {
      room: newRoom,
      sockets: [{
        socket: socket.id,
        username: username
      }],
      image: null
    }
    console.log("this is the error ------------------");
    console.error(roomInfo);
    roomInfo.push(currentRoom);
    io.to(newRoom).emit('update-room', currentRoom);
    console.log(`Created room: ${newRoom}`);
  }
};

function joinRoom(socket, room, username) {
  socket.username = username;
  socket.join(room);
  var roomToEdit = roomInfo.find(function(element) {
    return element.room === room;
  });
  roomToEdit.sockets.push({
    socket: socket.id,
    username: username
  })
  console.log(`Joined room: ${room}`);
  io.to(room).emit('update-room', roomToEdit);
  console.log(roomInfo);
};

function disconnectFromRoom(socket) {
  if(roomInfo.length > 0) {
    var foundsocket = null;
    var foundRoom = roomInfo.find(function(roomElement) {
        foundsocket = roomElement.sockets.find(function(socketElement) {
        return socketElement.socket === socket.id;
      });
      return foundsocket;
    });
    if(foundsocket) {
      foundRoom.sockets.splice( foundRoom.sockets.indexOf(foundsocket), 1 )
      io.to(foundRoom.room).emit('update-room', foundRoom);
    }
  }
}



var port = process.env.PORT || 3000;

http.listen(port, function(){
  console.log('listening on *:3000');
});