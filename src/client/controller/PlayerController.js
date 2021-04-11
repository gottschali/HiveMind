export class PlayerController {
    constructor(parent) {
        this.parent = parent;
    }

    installHooks() {
    }

    uninstallHooks() {
    }

    intendAction(action) {
        this.parent.reviewAction(action);
    }
}