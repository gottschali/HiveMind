export class Player {
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