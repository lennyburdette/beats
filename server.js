var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io').listen(server);

server.listen(process.env.PORT || 80);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.redirect('/' + Math.random().toString(36).substring(7, 12));
});

app.get('/:room', function (req, res) {
  res.render('index', { room: req.param('room') });
});

function getRoom (socket) {
  var rooms = io.sockets.manager.roomClients[socket.id];
  for (var room in rooms) {
    if (room !== '') return room.substr(1);
  }
}

io.sockets.on('connection', function (socket) {

  socket.on('joinRoom', function (data) {
    switch (io.sockets.clients(data.room).length) {
      case 0:
        socket.join(data.room);
        socket.set('color', data.color);
        socket.emit('roomJoined', { invited: false, color: data.color });
      break;
      case 1:
        var other = io.sockets.clients(data.room)[0];
        other.get('color', function (err, color) {
          socket.join(data.room);
          socket.emit('roomJoined', { invited: true, notColor: color });
          socket.broadcast.to(data.room).emit('inviteAccepted');
        });
      break;
      default:
        socket.emit('roomDenied');
      break;
    }
  });

  ['sync', 'controlEvent', 'feedback', 'playTrack'].forEach(function (event) {
    socket.on(event, function (data) {
      socket.broadcast.to(getRoom(socket)).emit(event, data);
    });
  });

  socket.on('disconnect', function () {
    socket.broadcast.to(getRoom(socket)).emit('roomLeft');
  });

});