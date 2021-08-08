export class HashMap extends Map {
    get(key){
        return super.get(JSON.stringify(key));
    }
    set(key, value){
        return super.set(JSON.stringify(key), value);
    }
    delete(key){
        return super.delete(JSON.stringify(key));
    }
    has(key){
      return super.has(JSON.stringify(key));
    }
    hiveHeight(key) {
        if (this.has(key)) {
            return this.get(key).length
        } else {
            return 0
        }
    }
    hivePush(key, value){
        if (this.has(key)) {
            return this.get(key).push(value)
        } else {
            return this.set(key, [value])
        }
    }
    hivePop(key){
        let arr = this.get(key)
        const res = arr.pop()
        if (arr.length === 0) {
            this.delete(key)
        }
        return res
    }
    keys(){
        return Array.from(super.keys()).map(k => JSON.parse(k))
    }
}
export class HashSet extends Set {
    add(value){
        return super.add(JSON.stringify(value));
    }
    has(value){
      return super.has(JSON.stringify(value));
    }
    *values(){
      for (const val of super.values()) {
        yield JSON.parse(val)
      }
    }
}
