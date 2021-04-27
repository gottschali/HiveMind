export class Player {
    constructor(parent, team) {
        this.parent = parent;
        this.team = team;
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
