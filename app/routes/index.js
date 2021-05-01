const express = require('express');
const router = express.Router();
import manager from '../../src/server/GameManager.js';

router.get('/', function(req, res, next) {
    res.redirect('/index')
});
router.get('/index', function(req, res, next) {
  res.render('index', { title: 'HiveMind' });
});
router.get('/test', function(req, res, next) {
    res.render('test', { title: 'Hive Test' });
});

router.get('/debug', function(req, res, next) {
    res.redirect(`/game?gid=0&mode=AUTO`)
});

router.get('/invite', function(req, res, next) {
    console.log("JOIN", req.body);
    const gid = req.query.gid;
    manager.join(gid);
    const mode = req.query.mode;
    manager.join(gid);
    res.redirect(`/game?gid=${gid}&mode=${mode}`);
});

router.get('/game', function(req, res, next) {
    res.render('game', { title: 'Play!' });
});
router.post('/create', function(req, res, next) {
    console.log("CREATE", req.body, req.body.mode);
    // Do via supervisor
    const mode = req.body.mode;
    let gid = 0;
    if (mode.startsWith("LOCAL")) {
    } else {
        gid = manager.create();
    }
    res.redirect(`/game?gid=${gid}&mode=${mode}`)
});
router.post('/join', function(req, res, next) {
    console.log("JOIN", req.body);
    const gid = req.body.gid;
    const mode = req.body.mode;
    if (mode.startsWith("REMOTEJOIN")) {
        manager.join(gid);
    }
    res.redirect(`/game?gid=${gid}&mode=${mode}`)
});

module.exports = router;
