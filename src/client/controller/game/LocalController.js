import {GameController} from "./GameController";
import {insects} from "../../../shared/model/insects";
import {teams} from "../../../shared/model/teams";

export class LocalController extends GameController{
    constructor(...args) {
        super(...args);
        this.delegate();
    }
    updateControls() {
        const team = this.parent.state.team;
        const opponent = (team === teams.WHITE ? teams.BLACK : teams.WHITE);
        $(`.drop.${opponent}`).prop("disabled", true);
        Object.values(insects).forEach( (name) => {
            if (this.parent.state.allowedToDrop(name)) {
                $(`.drop.${team}[data-insect=${name}]`).removeAttr("disabled");
            } else {
                $(`.drop.${team}[data-insect=${name}]`).prop("disabled", true);
            }
        });
    }

    reviewAction(action) {
        if (super.reviewAction(action)) {
            this.apply(action)
            this.delegate(action);
        }
    }
}