const express = require('express');
const socket = require('socket.io');

//  app setup
const app = express();

const server = app.listen(4000, _ => {
    console.log("listening on port 4000")
})

app.use(express.static('public'));

var count = 0;
var words = []
var wordCount = {}
// socket setup
const io = socket(server)

io.on('connection', socket => {
    count ++
    io.sockets.emit('broadcast', count + ' people online!')
    socket.on('disconnect', socket => {
        count--
        io.sockets.emit('broadcast', count + ' people online!');
    })

    socket.on('chat', data => {
        // sockets is referring to all of the socket on the server
        // emit a message
        io.sockets.emit('chat', data);

    })

    socket.on('typing', data => {
        socket.broadcast.emit('typing', data)
    })
})

// IDEAS
// -------
// live coding chatroom
// italian chatroom by passing every input through the google translate api.