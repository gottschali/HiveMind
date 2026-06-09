import Insect from "./insects";
import Stone from "./stone";
import Team from "./teams";
import * as HEX from "../hexlib";
import { Move, Drop, PassAction, Action } from "./action";
import { Hive } from "./hive";


export class State {
    hive: Hive;
    turnNumber: number;
    _stones: Map<Team, Array<Stone>>;
    _beeMove: Map<Team, boolean>;
    _actions: Array<Action>;
    _surrender: Team

    startingInsects: Array<Insect> = [
        Insect.BEE,
        Insect.SPIDER,
        Insect.SPIDER,
        Insect.ANT,
        Insect.ANT,
        Insect.ANT,
        Insect.GRASSHOPPER,
        Insect.GRASSHOPPER,
        Insect.GRASSHOPPER,
        Insect.BEETLE,
        Insect.BEETLE
    ]

    constructor() {
        this.hive = new Hive();
        this.turnNumber = 0;
        this._beeMove = new Map([
            [Team.WHITE, false],
            [Team.BLACK, false]
        ])
        this._stones = new Map();
        for (const team of [Team.WHITE, Team.BLACK]) {
            this._stones.set(team, this.startingInsects.map(insect => new Stone(insect, team)))
        }
    }
    get stones(): Array<Stone> {
        return this._stones.get(this.team);
    }

    get team(): Team {
        return this.turnNumber % 2 === 0 ? Team.WHITE : Team.BLACK
    }
    get gameOver(): boolean {
        if (this.result.some((x) => x)) {
            return true;
        }
        return false;
    }
    get result(): Array<boolean> {
        if (this._surrender === Team.WHITE) {
            return [true, false];
        } else if (this._surrender === Team.BLACK) {
            return [false, true];
        }
        return this.hive.gameResult()
    }
    surrender(team: Team) {
        this._surrender = team;
    }
    get moveAllowed(): boolean {
        return this._beeMove.get(this.team)
    }
    generateDrops(): Array<HEX.Hex> {
        if (this.turnNumber === 0) return [HEX.Hex(0, 0)];
        else if (this.turnNumber === 1) return [HEX.Hex(0, -1)];
        return this.hive.generateDrops(this.team)
    }
    _getActions(): Array<Action> {
        let opts = []
        const dropStonesForTeam = this.stones.map(stone => stone.insect);
        const uniqueInsects = new Set(dropStonesForTeam);
        const dropStones = Array.from(uniqueInsects)
            .map(insect => new Stone(insect, this.team));
        if (this.turnNumber >= 6 && !this.moveAllowed) {
            // Forced bee drop
            this.hive.generateDrops(this.team)
                .forEach(d => opts.push(new Drop(new Stone(Insect.BEE, this.team), d)))
        } else if (dropStones.length) {
            // Drops are allowed
            this.generateDrops()
                .forEach(dropHex => dropStones
                    .forEach(dropInsect => opts.push(new Drop(dropInsect, dropHex))))
        }
        if (this.moveAllowed) {
            // Moves allowed
            this.hive.generateMoves(this.team).forEach(([origin, dest]) => {
                opts.push(new Move(origin, dest))
            })
        }
        if (opts.length) return opts
        else return [PassAction]
    }
    get actions(): Array<Action> {
        if (!this._actions) this._actions = this._getActions()
        return this._actions
    }

    isLegal(action: Action): boolean {
        const res = this.actions.some(otherAction => action.compareTo(otherAction))
        return res;
    }
    apply(action: Action): State {
        // No check for legal action!
        // TODO apparently copying/cloning objects is not trivial in JS
        // So maybe just create new instance with the data as arguments
        // let newState = Object.assign(Object.create(Object.getPrototypeOf(this)), this)
        // State is mutable now, apply updates inplace instead of returning a new instance
        let stone: Stone;
        if (action instanceof Move) {
            // Remove the stone from the old position and add it at the new one
            stone = this.hive.at(action.origin)
            this.hive.removeStone(action.origin)
            this.hive.addStone(action.destination, stone)
        } else if (action instanceof Drop) {
            stone = action.stone
            if (stone.insect === Insect.BEE) {
                // Update that the bee is dropped
                this._beeMove.set(this.team, true)
            }
            // Remove the dropped stone from the availables and add it to the hive
            // TODO the stone is not removed because objects do not compare equal for values
            let index = -1;
            this.stones.forEach((s, i) => {
                if (stone.insect === s.insect) index = i
            })
            this.stones.splice(index, 1)
            this.hive.addStone(action.destination, stone)
        }
        delete this._actions
        this.turnNumber++
        return this;
    }

    undo(action: Action): State {
        let stone: Stone;
        if (action instanceof Move) {
            // Remove the stone from the new position and add it at the old one
            stone = this.hive.at(action.destination)
            this.hive.removeStone(action.destination)
            this.hive.addStone(action.origin, stone)
        } else if (action instanceof Drop) {
            stone = action.stone
            if (stone.insect === Insect.BEE) {
                this._beeMove.set(this.team, false)
            }
            this.stones.push(stone);
            this.hive.removeStone(action.destination);
        }
        delete this._actions
        this.turnNumber--
        return this;
    }

    step(policy = randomPolicy): State {
        return this.apply(policy(this.actions))
    }

    allowedToMove(hex: HEX.Hex): boolean {
        // Only needed for Frontend
        if (this.moveAllowed) {
            for (const action of this.actions) {
                if (action instanceof Move) {
                    if (HEX.hex_compare(action.origin, hex)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    allowedToDrop(insect: Insect): boolean {
        // Only needed for Fronted
        for (const action of this.actions) {
            if (action instanceof Drop) {
                if (action.stone.insect === insect) {
                    return true;
                }
            }
        }
        return false;
    }

    getDestinations(action: (Move | Drop), src: HEX.Hex): Array<[HEX.Hex, number]> {
        let opts = [];
        if (action instanceof Move) {
            opts = this.hive.generateMovesFrom(src)
                .map(h => [h, this.hive.height(h)]);
        } else if (action instanceof Drop) {
            opts = this.generateDrops()
                .map(h => [h, 0]);
        }
        return opts;
    }
}

function randomPolicy(actions: Array<Action>): Action {
    return actions[Math.floor(Math.random() * actions.length)]
}
