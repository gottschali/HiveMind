module.exports = function init(server) {
    const io = require('socket.io')(server);

    const {v4: uuidv4} = require('uuid');
    const {State} = require('../shared/model/state.js');

    class GameManager {
        constructor() {
            this.id = uuidv4();
        }

        initGame() {
            this.state = new State();
        }

        validateAction() {
            console.log("Not implemented");
            return true;
        }
    }

    let rooms = {};
    let managers = {};

    io.sockets.on('connection', function (socket) {
        socket.emit('message', {message: 'welcome to the chat'});
        socket.onAny((event, ...args) => {
            console.log("DEBUG", event, args);
        });
        // socket.on("joinGame", (gid) => {
        socket.on("joinGame", () => {
            const gid = "foobar";
            console.log(`Joins game ${gid}`);
            socket.join(gid);
            rooms[socket.id] = gid;
            io.to(gid).emit('startGame');
        });
        socket.on("createGame", () => {
            const GM = new GameManager();
            rooms[socket.id] = GM.id;
            managers[GM.id] = GM;
            socket.join(GM.id);
            console.log(`New Game ${GM.id}`);
            return GM.id;
        });
        socket.on("intendAction", (action) => {
            const GM = managers[socket.id];
            if (GM.validateAction(action)) {
                // Send to the room
                const room = rooms[socket.id];
                io.to(room).emit("updateAction", action);
            } else {
                // Respond only to sender
                io.to(socket.id).emit("rejectAction", action);
            }
        });
    });
    return io;
}