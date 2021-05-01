import {GameController} from './GameController.js';
import socket from '../socket.js';
import {insects} from "../../../shared/model/insects";
import {teams} from "../../../shared/model/teams";

export class RemoteController extends GameController {
    constructor(gid, team, ...args) {
        super(...args);
        this.gid = gid;
        this.team = team;
        socket.on("startGame", () => {
            this.start();
            $('#share-game-modal').modal('hide');
        });
        // Disable controls of opponent
        const opponent = (this.team === teams.WHITE ? teams.BLACK : teams.WHITE);
        $(`.drop.${opponent}`).prop("disabled", true);
    }
    updateControls() {
        const team = this.state.team;
        if (team === this.team) {
            Object.values(insects).forEach( (name) => {
                if (this.state.allowedToDrop(name)) {
                    $(`.drop.${team}[data-insect=${name}]`).removeAttr("disabled");
                } else {
                    $(`.drop.${team}[data-insect=${name}]`).prop("disabled", true);
                }
            });
        } else {
            $(`.drop.${this.team}`).prop("disabled", true);
        }
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
