const app = require("express")();
const server = require('http').createServer(app);
const io = require('./sockets.js')(server);

const indexRouter = require('./routes/index.js');
const lobbyRouter = require('./routes/lobby.js');


app.use('/', indexRouter);
app.use('/lobby', lobbyRouter);


server.listen(3000)

module.exports = server;
