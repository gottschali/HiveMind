import { Hex, hex_compare } from '../hexlib';
import Stone from './stone';

export class Action {
}

export class Move extends Action {
    origin: Hex;
    destination: Hex;

    constructor(origin?: Hex, destination?: Hex) {
        super();
        this.origin = origin;
        this.destination = destination;
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
}

export function compareAction(a: Action, b: Action): boolean {
    if (a instanceof Move && b instanceof Move) {
        return hex_compare(a.origin, b.origin) && hex_compare(a.destination, b.destination)
    } else if (a instanceof Drop && b instanceof Drop) {
        return a.stone.team === b.stone.team && a.stone.insect === b.stone.insect && hex_compare(a.destination, b.destination)
    } else if (a instanceof Pass && b instanceof Pass) return true;
    else return false;
}

export class Pass extends Action { };
