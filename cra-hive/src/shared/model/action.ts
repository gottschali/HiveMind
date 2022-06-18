import { Hex, hex_compare } from '../hexlib';
import Stone from './stone';

export abstract class Action {
    abstract compareTo(action: Action): boolean;
}

export function deserializeAction(json) {
    if ('stone' in json) {
        return new Drop(json.stone, json.destination);
    } else if ('origin' in json) {
        return new Move(json.origin, json.destination);
    } else {
        return new Pass();
    }
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
        return hex_compare(this.origin, action.origin) && hex_compare(this.destination, action.destination)
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
        return this.stone.team === action.stone.team && this.stone.insect === action.stone.insect && hex_compare(this.destination, action.destination)
    }
}

export class Pass extends Action {
    compareTo(action: Action): boolean {
        return action instanceof Pass;
    }
};

export const PassAction = new Pass();
