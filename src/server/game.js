const {v4: uuidv4} = require('uuid');
const {State} = require('../shared/model/state.js');

export class Game {

    constructor() {
        this.id = uuidv4();
    }

    init() {
        this.state = new State();
    }
    apply(action) {
        return this.state.apply(action)
    }

    validateAction(action) {
        return this.state.isLegal(action)
    }

}