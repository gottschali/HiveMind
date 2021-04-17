const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.redirect('/index')
});
router.get('/index', function(req, res, next) {
  res.render('index', { title: 'HiveMind' });
});


router.get('/lobby', function(req, res, next) {
  res.render('form', { title: 'Lobby' });
});
router.get('/game', function(req, res, next) {
  res.render('game', { title: 'Play!' });
});
router.post('/create', function(req, res, next) {
    console.log("CREATE", req);
    // Do via supervisor
    const mode = req.body.mode;
    let gid = 0;
    if (mode.startsWith("LOCAL")) {
    } else {
        // Do via supervisor
        gid = Math.floor(Math.random() * 1000).toString()
    }
    res.redirect(`/game?gid=${gid}&mode=${mode}`)
});
router.post('/join', function(req, res, next) {
    console.log("JOIN", req);
    const mode = req.body.mode;
    let gid = 0
    if (mode === "REMOTE") {
        // Do via supervisor
        gid = req.body.gid;
    }
    res.redirect(`/game?gid=${gid}&mode=${mode}`)
});

module.exports = router;
