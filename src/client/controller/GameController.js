import {State} from '../../shared/model/state.js';
import {Drop, Move} from '../../shared/model/action.js'
import {loadManager} from "../view/textures";
import {View} from "../view/view";

export class Controller {
    constructor(playerController1, playerController2, canvas) {
        // Maybe white black needs to be swapped
        this.white = new playerController1(this);
        this.black = new playerController2(this);
        this.state = new State();
        this.view = new View(this, canvas);
        this.delegate();

        loadManager.onLoad = () => {
            this.update();
        }
    }
    update() {
        return this.view.Paint.drawState(this.state);
    }
    delegate() {
        this.update();
        if (this.state.turnNumber > 0) {
            if (this.state.team === "WHITE") {
                this.white.installHooks();
                this.black.uninstallHooks();
            } else {
                this.white.uninstallHooks();
                this.black.installHooks();
            }
        } else {
            this.white.installHooks();
        }
    }
    handleClick(data) {
        if (this.state.team === "WHITE") {
            this.white.handleClick(data);

            this.black.handleClick(data);
        }
    }
    reviewAction(action) {
        // TODO logic depending on controllers (maybe in their classes)
        if (this.state.isLegal(action)) {
            this.state.apply(action);
            this.delegate();
        }
    }
    getHighlights(act, src) {
        let opts;
        if (act === Move) {
            opts = this.state.hive.generateMovesFrom(src)
                .map(h => [h, this.state.hive.height(h)]);
        } else if (act === Drop) {
            opts = this.state.generateDrops()
                .map(h => [h, 0]);
        }
        this.view.Paint.makeHighlightStones(opts);
    }
}