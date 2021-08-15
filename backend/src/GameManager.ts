import Game from './game'

class GameManager {
    games = new Map();
    constructor() {
        this.games.set("test", new Game("test"));
    }
    get(gid) {
        return this.games.get(gid);
    }
    create(gid) {
        const game = new Game(gid);
        this.games.set(gid, game);
    }
}
const manager = new GameManager();
export default manager