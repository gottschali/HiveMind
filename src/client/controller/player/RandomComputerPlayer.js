import {ComputerPlayer} from "./ComputerPlayer.js";

export class RandomComputerPlayer extends ComputerPlayer {
    installHooks() {
        super.installHooks();

        this.intendAction(this.choose(this.parent.state.actions))
    }

    choose(actions) {
        return actions[Math.floor(Math.random() * actions.length)]
    }
}