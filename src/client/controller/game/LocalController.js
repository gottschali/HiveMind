import {GameController} from "./GameController";
import $ from 'jquery';

export class LocalController extends GameController{
    constructor(...args) {
        super(...args);
        this.delegate();
    }
    delegate() {
        super.delegate();
        if (this.state.team === 'BLACK') {
            $('.drop.' + 'WHITE').prop("disabled", true);
            $('.drop.' + 'BLACK').prop("disabled", false);
        } else {
            $('.drop.' + 'WHITE').prop("disabled", false);
            $('.drop.' + 'BLACK').prop("disabled", true);
        }

    }
    reviewAction(action) {
        if (super.reviewAction(action)) {
            this.apply(action)
            this.delegate(action);
        }
    }
}