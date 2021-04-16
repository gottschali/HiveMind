import {Controller} from "./controller/GameController.js";
import {HumanController} from "./controller/HumanController";
import {RandomComputerController} from "./controller/RandomComputerController";
// import socket from  './socket.js';

const canvas = document.createElement('canvas');
canvas.id = "container";
// const element = document.createElement('div');

new Controller(HumanController, RandomComputerController, canvas);

// socket.send("Hello There");
// socket.emit("joinGame");

// document.body.appendChild(element);
document.body.appendChild(canvas);

