import { Router } from 'express';
import manager from '../GameManager';

const router = Router();

router.get('/', (req, res) => {
    const gameIDs = Array.from(manager.games.values()).map(game => game.id);
    res.json(gameIDs);
})
router.post('/:gid', (req, res) => {
    const gid = req.params.gid;
    manager.create(gid)
    res.send(`Creating game ${gid}`)
})

export default router;
