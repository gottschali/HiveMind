import {Game} from './game.js'

class GameManager {
    constructor() {
        this.games = {};
        this.games[0] = new Game();
    }
    get(gid) {
        return this.games[gid]
    }
    create() {
        const game = new Game();
        const gid = game.id;
        this.games[gid] = game;
        return gid;
    }
    join(gid) {
        const game = this.get(gid);
        game.init();
        // io.to(gid).emit('startGame');
    }
}
const manager = new GameManager();
export default manager