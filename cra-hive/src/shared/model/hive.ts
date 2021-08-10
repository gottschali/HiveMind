import Insect from './insects';
import Team from './teams';
import Stone from './stone';
import * as HEX from '../hexlib';
import { HashMap, HashSet } from '../hashmap';


export class Hive {
    map: HashMap;
    root: HEX.Hex;
    constructor() {
        this.map = new HashMap();
    }
    at(hex: HEX.Hex) {
        const ar = this.map.get(hex)
        return ar[ar.length - 1]
    }

    removeStone(hex: HEX.Hex) {
        this.map.get(hex).pop()
        if (!this.map.get(hex).length) {
            this.map.delete(hex)
        }
    }

    addStone(hex: HEX.Hex, stone: Stone) {
        this.root = hex
        if (!this.map.has(hex)) this.map.set(hex, [stone])
        else this.map.get(hex).push(stone)
    }

    gameResult(): Array<boolean> {
        let whiteLost = false
        let blackLost = false
        for (const hex of this.map.keys()) {
            const stone = this.map.get(hex)[0]
            if (stone.insect === Insect.BEE) {
                if (this.neighbors(hex).length === 6) {
                    if (stone.team === Team.WHITE) whiteLost = true
                    else blackLost = true
                }
            }
        }
        return [whiteLost, blackLost];
    }

    neighbors(hex: HEX.Hex): Array<HEX.Hex> {
        return HEX.hex_neighbors(hex).filter(n => this.map.has(n))
    }
    height(hex: HEX.Hex): number {
        if (this.map.has(hex)) return this.map.get(hex).length
        return 0
    }
    generateSingleWalks(hex: HEX.Hex, ignore=null): Array<HEX.Hex> {
        let result = []
        for (const [a, b, c] of HEX.hex_circle_iterator(hex)) {
            if (this.map.has(b)) continue
            if (ignore === null) {
                if (this.map.has(a) !== this.map.has(c)) result.push(b)
            } else {
                // ignore was probably not working because object comparison
                if ((this.map.has(a) && !HEX.hex_compare(a, ignore)) !== (this.map.has(c) && !HEX.hex_compare(c, ignore))) {      result.push(b)
                }
            }
        }
        return result
    }
    generateWalks(start: HEX.Hex, target=-1): Array<HEX.Hex> {
        let visited = new HashSet()
        let distance = new HashMap()
        let queue = []
        let result = []
        queue.push(start)
        distance.set(start, 0)
        while (queue.length) {
            const vertex = queue.shift()
            visited.add(vertex)
            for (const n of this.generateSingleWalks(vertex, start)) {
                if (visited.has(n)) continue
                distance.set(n, distance.get(vertex) + 1)
                queue.push(n)
            }
            if (target === -1 && !HEX.hex_compare(vertex, start)) {
              result.push(vertex)
            } else {
                let d = distance.get(vertex)
                if (d > target) continue
                if (d === target) result.push(vertex)
            }
            
        }
        return result
    }
    generateSpiderWalks(hex: HEX.Hex): Array<HEX.Hex> {
        return this.generateWalks(hex, 3)
    }
    generateJumps(hex: HEX.Hex): Array<HEX.Hex> {
        let result = []
        for (const offset of HEX.hex_directions) {
            if (this.map.has(HEX.hex_add(hex, offset))) {
                let i = 2
                while (this.map.has(HEX.hex_add(hex, HEX.hex_scale(offset,i)))) i++
                result.push(HEX.hex_add(hex, HEX.hex_scale(offset,i)))
            }
        }
        return result
    }
    generateClimbs(hex: HEX.Hex): Array<HEX.Hex> {
        let result = []
        let hh = this.height(hex)
        if (hh > 1) {
            for (const [a, b, c] of HEX.hex_circle_iterator(hex)){
                if (this.height(b) < hh) {
                    if ((this.height(a) < hh) || (this.height(c) < hh)) result.push(b)
                }
            }
        } else result.concat(this.generateSingleWalks(hex))
        for (const [a, b, c] of HEX.hex_circle_iterator(hex)) {
            let ha = this.height(a)
            let hb = this.height(b)
            let hc = this.height(c)
            if ((hb >= hh) && !(ha > hh && hc > hh)) result.push(b)
        }
        return result
    }

    _checkNeighborTeam(hex: HEX.Hex, team: Team): boolean {
        return this.neighbors(hex).every(n => this.at(n).team === team)
    }
    generateDrops(team: Team): Array<HEX.Hex> {
        let candidates = new HashSet()
        for (const hex of this.map.keys()) {
            HEX.hex_neighbors(hex)
              .filter(e => !this.map.has(e))
              .forEach(e => candidates.add(e))
        }
        return Array.from(candidates.values()).filter(e => this._checkNeighborTeam(e, team))
    }

    _oneHive(): HashSet {
        let lowLink = new HashMap()
        let visited = new HashSet()
        let index = new HashMap()
        let articulation_points = new HashSet()
        const dfs = (node: HEX.Hex, parent: HEX.Hex, counter: number) => {
            visited.add(node)
            counter++
            index.set(node, counter)
            lowLink.set(node, counter)
            let children = 0
            for (const n of this.neighbors(node)) {
                if (parent && HEX.hex_compare(n, parent)) continue
                if (visited.has(n)) lowLink.set(node, Math.min(lowLink.get(node), index.get(n)))
                else {
                    dfs(n, node, counter)
                    lowLink.set(node, Math.min(lowLink.get(node), lowLink.get(n)))
                    if (lowLink.get(n) >= index.get(node) && parent !== null) articulation_points.add(node)
                    children++
                }
            }
            if (parent === null && children >= 2) articulation_points.add(node)
        }
        // Need call because otherwise this is not bound in the nested function>
        if (this.root !== undefined) dfs.call(this, this.root, null, 0)
        return articulation_points
    }

    generateMovesFrom(hex: HEX.Hex): Array<HEX.Hex> {
        // insects.BEE ... instead of 0 ... causes error. Why?
        //
        const moveMap = new Map([
            [Insect.BEE, this.generateSingleWalks],
            [Insect.SPIDER, this.generateSpiderWalks],
            [Insect.ANT, this.generateWalks],
            [Insect.GRASSHOPPER, this.generateJumps],
            [Insect.BEETLE, this.generateClimbs]
        ]);
        return moveMap.get(this.at(hex).insect).call(this, hex)
    }

    generateMoves(team: Team): Array<Array<HEX.Hex>> {
        let result = []
        const articulation_points = this._oneHive()
        for (const hex of this.map.keys()) {
            if (this.at(hex).team === team) {
                if (this.height(hex) > 1 || !articulation_points.has(hex)) {
                    this.generateMovesFrom(hex).forEach((dest) => {
                        result.push([hex, dest])
                    })
                }
            }
        }
        return result
    }
}
