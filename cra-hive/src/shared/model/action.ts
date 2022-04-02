import { Hex } from '../hexlib';
import Stone from './stone';

export abstract class Action {
    abstract compareTo(action: Action): boolean;
}

export class Move extends Action {
    origin: Hex;
    destination: Hex;

    constructor(origin?: Hex, destination?: Hex) {
        super();
        this.origin = origin;
        this.destination = destination;
    }
    compareTo(action: Action): boolean {
        if (!(action instanceof Move))
            return false
        return this.origin.compareTo(action.origin) && this.destination.compareTo(action.destination)
    }
}

export class Drop extends Action {
    stone: Stone;
    destination: Hex;

    constructor(stone?: Stone, destination?: Hex) {
        super();
        this.stone = stone;
        this.destination = destination;
    }

    compareTo(action: Action): boolean {
        if (!(action instanceof Drop))
            return false
        return this.stone.team === action.stone.team && this.stone.insect === action.stone.insect && this.destination.compareTo(action.destination)
    }
}

export class Pass extends Action {
    compareTo(action: Action): boolean {
        return action instanceof Pass;
    }
};

export const PassAction = new Pass();
