import manager from './GameManager';
import { Server } from 'socket.io'
import { deserializeAction } from '../../cra-hive/src/shared/model/action';

export default function init(server) {
    const io = new Server(server);

    io.sockets.on('connection', function (socket) {
        socket.emit('message', {message: 'Welcome to HiveMind'});
        socket.onAny((event, ...args) => {
            console.log('DEBUG', event, args);
        });

        socket.on('joinGame', ({gid, team}) => {
            socket.join(gid);
            const game = manager.get(gid)
            if (!game) return false;
            if (team == 'white') {
                game.playerWhite = socket;
            } else if (team == 'black') {
                game.playerBlack = socket;
            } else {
                console.error("Unknown team type joined: " + team);
            }
            for (let action of game.history) {
                // TODO transfer entire state instead of entire history
                socket.emit('updateAction', action);
            }
            socket.on('intendAction', (json) => {
                const action = deserializeAction(json.action)
                if (game.validateAction(action)) {
                    // Send to the room
                    game.apply(action);
                    io.to(gid).emit('updateAction', action);
                    // io.to(gid).emit('updateState', game.state);
                } else {
                    // Respond only to sender
                    return false;
                }
            })

            socket.on('chatMessage', (text) => {
                const message = {text, sender: socket.id, time: Date.now()};
                io.to(gid).emit('chatMessage', message);
            })

            socket.on('surrender', () => {
                io.to(gid).emit('surrender', {team: team});
            });

            if (game.playerConnected()) {
                io.to(gid).emit('startGame');
            }
        });
        socket.on('createGame', (gid) => {
            manager.create(gid);
        });
    });
    return io;
}
