import Insect from "./insects";
import Stone from "./stone";
import Team from "./teams";
import {HashSet} from "../hashmap";
import * as HEX from "../hexlib";
import {Move, Drop, Pass, Action} from "./action";
import {Hive} from "./hive";


export class State {
    hive: Hive;
    turnNumber: number;
    stones: Array<Stone>;
    _beeMove: Map<Team, boolean>;
    _actions: Array<Action>;

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

    constructor(turnNumber = 0) {
        this.hive = new Hive();
        this.turnNumber = turnNumber
        this.stones = [];
        this._beeMove = new Map([
            [Team.WHITE, false],
            [Team.BLACK, false]
        ])
        for (const team of [Team.WHITE, Team.BLACK]) for (const insect of this.startingInsects) {
            this.stones.push(new Stone(insect, team))
        }
    }

    get team() {
        return this.turnNumber % 2 === 0 ? Team.WHITE : Team.BLACK
    }
    get gameOver() {
        if (this.result.some( (x) => x)) {
            return this.result;
        }
        return false;
    }
    get result() {
        return this.hive.gameResult()
    }
    get moveAllowed() {
        return this._beeMove.get(this.team)
    }
    generateDrops() {
        if (this.turnNumber === 0) return [HEX.Hex(0, 0)];
        else if (this.turnNumber === 1) return [HEX.Hex(0, -1)];
        return this.hive.generateDrops(this.team)
    }
    _getActions() {
        let opts = []
        const dropStonesForTeam = this.stones.filter(stone => stone.team === this.team)
                                .map(s => s.insect)
        const uniqueInsects = new Set(dropStonesForTeam);
        const dropStones = Array.from(uniqueInsects)
                                .map(insect => new Stone(insect, this.team));
        if (this.turnNumber >= 6 && !this.moveAllowed) {
            console.log("Forced bee drop")
            this.hive.generateDrops(this.team).forEach(d => opts.push(new Drop(new Stone(Insect.BEE, this.team), d)))
        } else if (dropStones.length) {
            console.log("Drops allowed")
            this.generateDrops().forEach(d => dropStones.forEach(ds => opts.push(new Drop(ds, d))))
        }
        if (this.moveAllowed) {
            console.log("Moves allowed")
            this.hive.generateMoves(this.team).forEach(([origin, dest]) => {
                opts.push(new Move(origin, dest))
            })
        }
        if (opts.length) return opts
        else return [Pass]
    }
    get actions() {
        if (!this._actions) this._actions = this._getActions()
        return this._actions
    }

    isLegal(action) {
        const acts = new HashSet(this.actions);
        return acts.has(action)
    }
    apply(action) {
        // No check for legal action!
        // TODO apparently copying/cloning objects is not trivial in JS
        // So maybe just create new instance with the data as arguments
        // let newState = Object.assign(Object.create(Object.getPrototypeOf(this)), this)
        // State is mutable now, apply updates inplace instead of returning a new instance
        console.log(`Applying ${JSON.stringify(action)}`)
        let stone
        if ("origin" in action && "destination" in action) {
            // Remove the stone from the old position and add it at the new one
            stone = this.hive.at(action.origin)
            this.hive.removeStone(action.origin)
            this.hive.addStone(action.destination, stone)
        } else if ("stone" in action && "destination" in action) {
            stone = action.stone
            if (stone.insect === Insect.BEE) {
                // Update that the bee is dropped
                this._beeMove.set(this.team, true)
            }
            // Remove the dropped stone from the availables and add it to the hive
            // TODO the stone is not removed because objects do not compare equal for values
            let index = -1;
            this.stones.forEach((s, i) => {
              if (JSON.stringify(s) === JSON.stringify(stone)) index = i
            })
            this.stones.splice(index, 1)
            this.hive.addStone(action.destination, stone)
        }
        delete this._actions
        this.turnNumber++
        return this;
    }

    step(policy=randomPolicy) {
        return this.apply(policy(this.actions))
    }

    allowedToMove(hex) {
        // This is used called from the UI so performance is not priority
        if (this.moveAllowed) {
            for (const action of this.actions) {
                if ("origin" in action) {
                    if (HEX.hex_compare(action.origin, hex)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    allowedToDrop(insect) {
        // This is used called from the UI so performance is not priority
        for (const action of this.actions) {
            if ("stone" in action) {
                if (action.stone.insect === insect) {
                    return true;
                }
            }
        }
        return false;
    }

    getDestinations(action, src) {
        let opts = [];
        if (action === Move) {
            opts = this.hive.generateMovesFrom(src)
                .map(h => [h, this.hive.height(h)]);
        } else if (action === Drop) {
            opts = this.generateDrops()
                .map(h => [h, 0]);
        }
        return opts;
    }
}

function randomPolicy(actions) {
    return actions[Math.floor(Math.random() * actions.length)]
}
