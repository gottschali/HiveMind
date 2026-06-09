import { State } from "../shared/model/state";

class Game {
    id;
    state;
    history = [];
    playerWhite;
    playerBlack;
    constructor(gid) {
        this.id = gid;
        this.history = [];
        this.state = new State();
    }
    playerConnected() {
        return this.playerWhite && this.playerBlack;
    }
    apply(action) {
        this.history.push(action);
        return this.state.apply(action)
    }

    validateAction(action) {
        return this.state.isLegal(action)
    }

}
export default Game;
