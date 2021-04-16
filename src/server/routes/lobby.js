const router = require('express').Router();
const game_controller = require('../controllers/game_controller');

// router.get("/lobby", game_controller.show_lobby);

router.post("/create", game_controller.create_game);

router.post("/join", game_controller.join_game);

module.exports = router;