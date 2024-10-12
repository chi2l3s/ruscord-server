const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Использование CORS
app.use(cors({
    origin: '*', // Замените на адрес вашего клиента
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.get('/', (req, res) => {
    res.send('Server is running');
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinChannel', ({ channelId }) => {
        if (!channelId) return;
    
        socket.join(channelId);
    
        console.log(`User joined channel ${channelId}`);
    });

    socket.on('leaveChannel', ({ channelId }) => {
        if (!channelId) return;
    
        socket.leave(channelId);
    
        console.log(`User left channel ${channelId}`);
    });

    socket.on('chatMessage', (data) => {
        data.channelId = data.channelId || '';
        socket.to(data.channelId).emit('chatMessage', data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
