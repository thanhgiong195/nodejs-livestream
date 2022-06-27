const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');
//const { ExpressPeerServer } = require('peer');

//const peerServer = ExpressPeerServer(server, {
//  debug: true
//});

app.set('view engine', 'ejs');
//app.use('/peerjs', peerServer);
app.use(express.static('public'));

app.get('/', (req, res) => {
  //res.redirect(`/${uuidV4()}`);
  res.redirect(`/room1`);
});

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
});

io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

io.on('connection', socket => {
	console.log('connection server'); 
	console.log(socket.id);
  socket.on('join-room', (roomId, userId) => {
	console.log('join-room server', roomId, userId); 
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    });
  });
});

server.listen(3000);
