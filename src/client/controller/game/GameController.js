import {State} from '../../../shared/model/state.js';
import {insects} from "../../../shared/model/insects";
import $ from 'jquery';
import {loadManager} from "../../view/textures";
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

        // Move to view
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
        return this.view.makeHighlightStones(this.state.getDestinations(action, src));
    }
    updateControls() {
        // TODO move to view
        // TODO bad repetitions
        if (this.state.team === 'BLACK') {
            $('.drop.' + 'WHITE').prop("disabled", true);
            Object.values(insects).forEach( (name) => {
                if (this.state.allowedToDrop(name)) {
                    console.log(name, "drop");
                    $(`.drop.BLACK[data-insect=${name}]`).removeAttr("disabled");
                } else {
                    console.log(name, "NO drop");
                    $(`.drop.BLACK[data-insect=${name}]`).prop("disabled", true);
                }
            });
        } else {
            $('.drop.' + 'BLACK').prop("disabled", true);
            Object.values(insects).forEach( (name) => {
                if (this.state.allowedToDrop(name)) {
                    console.log(name, "drop");
                    $(`.drop.WHITE[data-insect=${name}]`).removeAttr("disabled");
                } else {
                    console.log(name, "NO drop");
                    $(`.drop.WHITE[data-insect=${name}]`).prop("disabled", true);
                }
            });
        }
    }
}
