import {GameController} from "./GameController";

export class LocalController extends GameController{
    constructor(...args) {
        super(...args);
        this.delegate();
    }
    reviewAction(action) {
        if (super.reviewAction(action)) {
            this.state.apply(action)
            this.delegate();
        }
    }
}