import {State} from '../../../shared/model/state.js';
import {loadManager} from "../../view/textures";
import {View} from "../../view/view";
import dropMenu from "../dropMenu";

const timer = ms => new Promise( res => setTimeout(res, ms));

export class GameController {
    constructor(playerController1, playerController2, canvas) {
        // Maybe white black needs to be swapped
        this.white = new playerController1(this, "WHITE");
        this.black = new playerController2(this, "BLACK");
        this.state = new State();
        this.view = new View(this, canvas);
        this.dropMenu = new dropMenu(this);

        loadManager.onLoad = () => {
            this.update();
        }
        this.update()
    }
    apply(action) {
        this.state.apply(action);
        this.view.apply(action);
        this.dropMenu.apply(action);
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
        this.dropMenu.updateControls();
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
}
