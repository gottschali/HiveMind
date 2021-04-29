import {LocalPlayer} from "./LocalPlayer.js"

import {Move, Drop, Pass} from '../../../shared/model/action.js';
import {Stone} from '../../../shared/model/stone.js';
import $ from 'jquery';

export class HumanPlayer extends LocalPlayer {
    installHooks() {
        super.installHooks();
        this.buttonControls();
        this.clearHighlights();
    }
    buttonControls() {
        const ref = this;
        $('.drop.' + this.team).on('click', function() {
            const insect = $(this).attr('data-insect');
            console.log(`Clicked on ${insect}`);
            ref.handleClick(["drop", insect]);
        });
    }

    wantsHighlights() {
        this.parent.getHighlights(this.actionType, this.firstArg);
    }
    clearHighlights() {
        this.actionType = Pass
        this.wantsHighlights();
    }

    handleClick(data) {
        const [type, selection] = data;
        if (type === "stones") {
            if (this.parent.state.allowedToMove(selection)) {
                this.firstArg = selection;
                this.actionType = Move;
                this.wantsHighlights()
            } else {
                console.log("Insect is not allowed to move. Is the bee dropped? Onehive?");
                this.clearHighlights()
            }
        } else if (type === "destination") {
            const action = new this.actionType(this.firstArg, selection);
            this.intendAction(action);
        } else if (type === "drop") {
            if (this.parent.state.allowedToDrop(selection)) {
                this.firstArg = new Stone(selection, this.team);
                this.actionType = Drop;
                this.wantsHighlights()
            } else {
                console.log("Insect can not be dropped! Have you dropped the Queen yet? Is it impossible to drop a stone?");
                this.clearHighlights()
            }
        }
    }
}
