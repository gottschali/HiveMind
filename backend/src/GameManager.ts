import Game from './game'

class GameManager {
    games = new Map();
    constructor() {
        this.games.set("test", new Game());
    }
    get(gid) {
        return this.games.get(gid);
    }
    create() {
        const game = new Game();
        const gid = game.id;
        this.games.set(gid, game);
        return gid;
    }
    join(gid) {
        const game = this.get(gid);
        // io.to(gid).emit('startGame');
    }
}
const manager = new GameManager();
export default manager