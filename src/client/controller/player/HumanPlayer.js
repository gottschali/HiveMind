import {LocalPlayer} from "./LocalPlayer.js"

import {Move, Drop} from '../../../shared/model/action.js';
import {Stone} from '../../../shared/model/stone.js';
import $ from 'jquery';

export class HumanPlayer extends LocalPlayer {
    installHooks() {
        this.firstArg = null;
        this.actionType = null;
        this.buttonControls()
    }
    buttonControls() {
        const ref = this;
        $('.drop.' + this.team).on('click', function() {
            const insect = $(this).attr('data-insect');
            console.log(`Clicked on ${insect}`);
            ref.firstArg = new Stone(insect, ref.team);
            ref.actionType = Drop;
            ref.wantsHighlights()
        });
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
        }
    }
}
