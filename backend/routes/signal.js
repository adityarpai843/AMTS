const signal = require('../controller/signal');
const router = require('express').Router();

router.post('/signals', signal.sendSignal);

module.exports = router;