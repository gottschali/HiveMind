import {State} from '../../../shared/model/state';
import {loadManager} from "../../view/models";
import {View} from "../../view/view";

const timer = ms => new Promise( res => setTimeout(res, ms));

export class GameController {
    constructor(playerController1, playerController2, canvas) {
        // Maybe white black needs to be swapped
        this.white = new playerController1(this, "WHITE");
        this.black = new playerController2(this, "BLACK");
        this.state = new State();
        this.view = new View(this, canvas);

        loadManager.onLoad = () => {
            this.update();
        }
        this.update()
    }
    apply(action) {
        this.state.apply(action);
        this.view.apply(action);
        if ("stone" in action) {
            const stone = action.stone;
            const button = $(`.drop.${stone.team}[data-insect="${stone.insect}"]`)
            const num = button.data('num');
            button.data('num', num - 1);
            button.find('.badge').html(num - 1);
        }
    }
    update() {
        return this.view.drawState(this.state);
    }
    updateControls() {

    }
    delegate() {
        // this.update();
        timer(20).then( () => {
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
        });
        this.updateControls();
    }
    handleClick(data) {
        if (this.state.team === "WHITE") {
            this.white.handleClick(data);
        } else {
            this.black.handleClick(data);
        }
    }
    reviewAction(action) {
        return this.state.isLegal(action)
    }
    getHighlights(action, src) {
        return this.view.makeHighlightStones(this.state.getDestinations(action, src), this.state.team);
    }
}
