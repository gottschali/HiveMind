import {ComputerController} from "./ComputerController";

export class RandomComputerController extends ComputerController {
    installHooks() {
        super.installHooks();

        this.intendAction(this.choose(this.parent.state.actions))
    }

    choose(actions) {
        return actions[Math.floor(Math.random() * actions.length)]
    }
}