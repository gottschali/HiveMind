class HashMap {
    map = new Map();
    get(key){
        return this.map.get(JSON.stringify(key));
    }
    set(key, value){
        return this.map.set(JSON.stringify(key), value);
    }
    delete(key){
        return this.map.delete(JSON.stringify(key));
    }
    has(key){
      return this.map.has(JSON.stringify(key));
    }
    hiveHeight(key) {
        if (this.map.has(key)) {
            return this.get(key).length
        } else {
            return 0
        }
    }
    hivePush(key, value){
        if (this.map.has(key)) {
            return this.map.get(key).push(value)
        } else {
            return this.map.set(key, [value])
        }
    }
    hivePop(key){
        let arr = this.map.get(key)
        const res = arr.pop()
        if (arr.length === 0) {
            this.map.delete(key)
        }
        return res
    }
    keys() {
        return Array.from(this.map.keys()).map(k => JSON.parse(k))
    }
}
class HashSet {
    set: Set<string> = new Set();
    add(value) {
        return this.set.add(JSON.stringify(value));
    }
    has(value) {
      return this.set.has(JSON.stringify(value));
    }
    values() {
      return Array.from(this.set.values()).map(val => JSON.parse(val))
    }
}

export {HashMap, HashSet}