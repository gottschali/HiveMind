import {v4 as uuidv4} from 'uuid';
import { State } from '../../cra-hive/src/shared/model/state'

class Game {
    id;
    state;
    constructor() {
        this.id = uuidv4();
        this.state = new State();
    }
    apply(action) {
        return this.state.apply(action)
    }

    validateAction(action) {
        return this.state.isLegal(action)
    }

}
export default Game;