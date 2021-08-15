import { State } from '../../cra-hive/src/shared/model/state'

class Game {
    id;
    state;
    history = [];
    constructor(gid) {
        this.id = gid;
        this.history = [];
        this.state = new State();
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