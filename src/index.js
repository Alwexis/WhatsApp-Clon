import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server as WebSocketServer } from 'socket.io';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new WebSocketServer(server);

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    socket.on('chat:connected', (data) => {
        socket.join("global");
        io.sockets.emit('rooms:joined', { username: data.username, room: "global" })
    });

    socket.on('chat:message', (data) => {
        io.sockets.emit('chat:message_recieved', data);
    });

    socket.on('rooms:change', (data) => {
        socket.leave(data.actual_room);
        socket.join(data.new_room);
        io.sockets.emit('rooms:joined', { username: data.username, room: data.new_room })
    })
})

server.listen(3000);
console.log('Listening on port:', 3000);