const router = require('express').Router()

router.get('/', (req, res) => {
    res.send('Hello There')
})

module.exports = router;
