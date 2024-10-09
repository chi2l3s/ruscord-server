const cors = require('cors');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Используйте cors
app.use(cors({
    origin: '*', // Замените на адрес вашего клиента
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.get('/', (req, res) => {
    res.send('Server is running');
});

// Обработка соединений
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('chatMessage', (message) => {
        // Рассылаем сообщение всем подключенным пользователям
        socket.broadcast.emit('chatMessage', message);
    });

    socket.on('offer', (offer) => {
        socket.broadcast.emit('offer', offer);
    });

    socket.on('answer', (answer) => {
        socket.broadcast.emit('answer', answer);
    });

    socket.on('candidate', (candidate) => {
        socket.broadcast.emit('candidate', candidate);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
