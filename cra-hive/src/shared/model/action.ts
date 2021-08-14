import { Hex, hex_compare } from '../hexlib';
import Stone from './stone';

export class Move {
    origin: Hex;
    destination: Hex;

    constructor(origin?: Hex, destination?: Hex) {
        this.origin = origin;
        this.destination = destination;
    }
}

export class Drop {
    stone: Stone;
    destination: Hex;

    constructor(stone?: Stone, destination?: Hex) {
        this.stone = stone;
        this.destination = destination;
    }
}

export function compareAction(a: Action, b: Action): boolean {
    if ('origin' in a && 'origin' in b) {
        return hex_compare(a.origin, b.origin) && hex_compare(a.destination, b.destination)
    } else if ('stone' in a && 'stone' in b) {
        return a.stone.team === b.stone.team && a.stone.insect === b.stone.insect && hex_compare(a.destination, b.destination)
    } else if (b === Pass) return true;
    else return false;
}

export class Pass {};

export type Action = Drop | Move | Pass;
