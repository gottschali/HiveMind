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
        });
        socket.on("createGame", (gid) => {
            socket.join(gid);
        });
        socket.on("intendAction", (args) => {
            console.log(args)
            const game = manager.get(args.gid)
            if (game.validateAction(args.action)) {
                // Send to the room
                game.apply(args.action);
                io.to(args.gid).emit("updateAction", args.action);
            } else {
                // Respond only to sender
                return false;
            }
        });
    });
    return io;
}