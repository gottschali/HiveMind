import {insects} from "../../shared/model/insects";
import {teams} from "../../shared/model/teams";
import $ from 'jquery';

export default class dropMenu {
    constructor(parent) {
        this.parent = parent;
    }
    updateControls() {
        // TODO bad repetitions
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
    apply(action)  {
        if ("stone" in action) {
            const stone = action.stone;
            const button = $(`.drop.${stone.team}[data-insect="${stone.insect}"]`)
            const num = button.data('num');
            button.data('num', num - 1);
            button.find('.badge').html(num - 1);
        }
    }
}