export class PlayerController {
    constructor(parent) {
        this.parent = parent;
    }

    installHooks() {
    }

    uninstallHooks() {
    }
    handleClick(...args) {
    }

    intendAction(action) {
        this.parent.reviewAction(action);
    }
}