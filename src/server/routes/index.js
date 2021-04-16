const router = require('express').Router();

router.get('/', function(req, res) {
    res.redirect('/lobby');
});

module.exports = router;