import http from 'http';
import { app } from './app';
import { Server } from "socket.io";

const PORT = process.env.PORT || 4001;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
});

io.on('connection', (socket) => {
    console.log(socket.id);
});

if (process.env.NODE_ENV !== 'test')
    server.listen(PORT, () =>
        console.log(`server running on http://localhost:${PORT}`)
    );

export { server, io }