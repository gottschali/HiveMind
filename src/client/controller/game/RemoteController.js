import {GameController} from './GameController.js';
import socket from '../socket.js';

export class RemoteController extends GameController {
    constructor(gid, ...args) {
        super(...args);
        this.gid = gid;
        socket.on("startGame", () => this.start() );
    }
    join() {
        socket.emit("joinGame", this.gid)
    }
    create() {
        socket.emit("createGame", this.gid)
    }
    start() {
        socket.on("updateAction", (action) => {
            this.apply(action)
            console.log(action, this.state)
            this.delegate();
        })
        this.delegate();
    }
    reviewAction(action) {
        if (super.reviewAction(action)) {
            socket.emit("intendAction", {action: action, gid: this.gid}, (err) => {
                // Action rejected
            });
        }
    }


}
