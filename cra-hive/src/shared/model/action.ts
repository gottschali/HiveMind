import { Hex } from '../hexlib';
import Stone from './stone';

export class Move {
    origin: Hex;
    destination: Hex;

    constructor(origin: Hex, destination: Hex) {
        this.origin = origin;
        this.destination = destination;
    }
}

export class Drop {
    stone: Stone;
    destination: Hex;

    constructor(stone: Stone, destination: Hex) {
        this.stone = stone;
        this.destination = destination;
    }
}

export class Pass {};

export type Action = Drop | Move | Pass;
