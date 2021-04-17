import {Controller} from "./controller/GameController.js";
import {HumanController} from "./controller/HumanController";
import {RandomComputerController} from "./controller/RandomComputerController";
import {RemoteController} from "./controller/RemoteController";

// import socket from  './socket.js';


function init() {
    const canvas = document.createElement('canvas');
    canvas.id = "view-container";
    document.body.appendChild(canvas);
    const url = new URLSearchParams(window.location.href);
    const mode = url.get("mode");
    const gid = url.get("gid");
    let c1, c2;
    if (mode === "LOCAL") {
        c1 = HumanController;
        c2 = RandomComputerController;
    } else if (mode === "LOCALLOCAL") {
        c1 = HumanController;
        c2 = HumanController;
    } else if (mode === "REMOTECREATE") {
        c1 = RemoteController;
        c2 = HumanController;
    } else if (mode === "REMOTECREATE") {
        c1 = HumanController;
        c2 = RemoteController;
    }
    const controller = new Controller(c1, c2, canvas);
}

init();

// socket.send("Hello There");
// socket.emit("joinGame");


