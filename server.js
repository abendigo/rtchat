


const os = require('os');
const socketIO = require('socket.io');
const http = require('http');
const nodeStatic = require('node-static');

var fileServer = new(nodeStatic.Server)('./public');
var app = http.createServer(function(req, res) {
  fileServer.serve(req, res);
}).listen(8081);

let io = new socketIO(app);

let users = {};
let rooms = ["One", "Two", "Six"];

io.on('connection', socket => {
  console.log('connection');

  users[socket.id] = {};
  console.log('users', JSON.stringify(users));

  socket.on('disconnect', _ => {
    console.log('disconnect');
    delete users[socket.id];

    io.emit('users', users);
  });

  socket.on('aaa', data => {
    console.log('connect', data);
    users[socket.id].name = data;
    console.log('users', JSON.stringify(users));

    // socket.emit('rooms', rooms);
    io.emit('users', users);
  });

  socket.on('message', (target, data) => {
    console.log('message', target, data)

    if (io.sockets.connected[target])
      io.sockets.connected[target].emit('message', socket.id, data);
  });
  socket.on('signaling', (target, data) => {
    console.log('signaling', target, data)

    if (io.sockets.connected[target])
      io.sockets.connected[target].emit('signaling', socket.id, data);
  });
});
