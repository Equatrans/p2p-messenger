const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('Connected:', socket.id);

    socket.on('register', (peerId) => {
        socket.peerId = peerId;
        console.log(`Registered: ${peerId}`);
    });

    // Сигналинг для WebRTC
    socket.on('offer', (data) => io.to(data.target).emit('offer', data));
    socket.on('answer', (data) => io.to(data.target).emit('answer', data));
    socket.on('ice-candidate', (data) => io.to(data.target).emit('ice-candidate', data));

    socket.on('disconnect', () => console.log('Disconnected:', socket.id));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});