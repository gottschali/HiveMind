const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('home', { title: 'HiveMind' });
});


router.get('/lobby', function(req, res, next) {
  res.render('form', { title: 'Lobby' });
});
router.get('/game', function(req, res, next) {
  res.render('game', { title: 'Play!' });
});
router.post('/create', function(req, res, next) {
    console.log("CREATE", req);
    const gid = Math.floor(Math.random() * 1000).toString()
    // TODO create logic
    res.redirect(`/game?gid=${gid}`)
});
router.post('/join', function(req, res, next) {
    console.log("JOIN", req);
    // TODO join logic
    const gid = req.body.gid;
    res.redirect(`/game?gid=${gid}`)
});

module.exports = router;
