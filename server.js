var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.send('<h1>Server is running!</h1>');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(1991, function(){
  console.log('listening on *:1991');
});