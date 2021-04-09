import {State} from '../shared/model/state.js';

export class GameController {
    constructor(playerController1, playerController2, canvas) {
        this.p1 = playerController1;
        this.p2 = playerController2;
        this.state = new State();
    }
}
class PlayerController {

}

class LocalController extends PlayerController {

}

class HumanController extends LocalController {

}

class ComputerController extends LocalController {

}

class RandomComputerController extends ComputerController {

}

class RemoteController extends PlayerController {

}