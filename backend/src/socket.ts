import manager from './GameManager';
import { Server } from 'socket.io'

export default function init(server) {
    const io = new Server(server);

    io.sockets.on('connection', function (socket) {
        socket.emit('message', {message: 'Welcome to HiveMind'});
        socket.onAny((event, ...args) => {
            console.log("DEBUG", event, args);
        });
        socket.on("joinGame", (gid) => {
            socket.join(gid);
            io.to(gid).emit('startGame');

            const game = manager.get(gid)

            socket.on("intendAction", ({ action }) => {
                if (game.validateAction(action)) {
                    // Send to the room
                    game.apply(action);
                    io.to(gid).emit("updateAction", action);
                } else {
                    // Respond only to sender
                    return false;
                }
            })
        });
        socket.on("createGame", (gid) => {
            socket.join(gid);
        });
    });
    return io;
}