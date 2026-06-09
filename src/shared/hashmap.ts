export class HashMap<K, V> {
    private map: Map<string, V>;

    constructor() {
        this.map = new Map<string, V>();
    }

    get(key: K): V {
        return this.map.get(JSON.stringify(key));
    }

    set(key: K, value: V) {
        return this.map.set(JSON.stringify(key), value);
    }

    delete(key: K) {
        return this.map.delete(JSON.stringify(key));
    }

    has(key: K) {
        return this.map.has(JSON.stringify(key));
    }

    *keys(): Generator<K> {
        for (const key of this.map.keys()) {
            yield JSON.parse(key);
        }
    }
}
export class HashSet<V> {
    private set: Set<string> = new Set();
    add(value: V) {
        return this.set.add(JSON.stringify(value));
    }
    has(value: V) {
        return this.set.has(JSON.stringify(value));
    }
    *values(): Generator<V> {
        for (const value of this.set.values()) {
            yield JSON.parse(value);
        }
    }
}

