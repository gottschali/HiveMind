import express from 'express';
import * as http from 'http';
import path from 'path';

import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import debug from 'debug';

import gameRouter from './routes/routes.game';
import initSocketIO from './socket'

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = process.env.PORT || 4000;
const debugLog: debug.IDebugger = debug('app');

app.use('/game', gameRouter);

// here we are adding middleware to parse all incoming requests as JSON 
app.use(express.json());

// here we are adding middleware to allow cross-origin requests
app.use(cors());

const io = initSocketIO(server);

// here we are preparing the expressWinston logging middleware configuration,
// which will automatically log all HTTP requests handled by Express.js
const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
    ),
};

if (!process.env.DEBUG) {
    loggerOptions.meta = false; // when not debugging, log requests as one-liners
}

// initialize the logger with the above configuration
app.use(expressWinston.logger(loggerOptions));

// here we are adding the UserRoutes to our array,
// after sending the Express.js application object to have the routes added to our app!

// this is a simple route to make sure everything is working properly
const runningMessage = `Server running at http://localhost:${port}`;

//  app.use(express.static(path.join(__dirname, 'build')));


// if (!process.env.DEBUG) {
//     app.use(express.static(path.join(__dirname, '..', '..', '..', '..', 'cra-hive', 'build')))
//     app.use("favicon", express.static(path.join(__dirname, '..', '..', '..', '..', 'cra-hive', 'build', 'favicon')))
//     app.get('/*', function (req, res) {
//         res.sendFile(path.join(__dirname, '..', '..', '..', '..', 'cra-hive', 'build', 'index.html'));
//     });
// } else {
//     app.use(express.static(path.join(__dirname, '..', '..', 'cra-hive', 'build')))
//     app.get('/*', function (req, res) {
//         res.sendFile(path.join(__dirname, '..', 'dist', 'build', 'index.html'));
//     });
// }

server.listen(port, () => {
    console.log(runningMessage);
});
