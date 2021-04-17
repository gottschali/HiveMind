import {LocalPlayer} from "./LocalPlayer.js"

import {Move, Drop} from '../../../shared/model/action.js';
import {Stone} from '../../../shared/model/stone.js';

export class HumanPlayer extends LocalPlayer {
    installHooks() {
        this.firstArg = null;
        this.actionType = null;
    }

    setDestination(hex) {
        const action = new this.actionType(this.firstArg, hex);
        this.intendAction(action);
    }

    wantsHighlights() {
        this.parent.getHighlights(this.actionType, this.firstArg);
    }

    handleClick(data) {
        const [type, selection] = data;
        if (type === "stones") {
            this.firstArg = selection;
            this.actionType = Move;
            this.wantsHighlights()
        } else if (type === "destination") {
            this.setDestination(selection)
        } else if (type === "drops") {
            this.firstArg = new Stone(selection, this.parent.state.team);
            this.actionType = Drop;
            this.wantsHighlights()
        }
    }
}