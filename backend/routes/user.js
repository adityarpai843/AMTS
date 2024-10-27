const user = require('../controller/user');
const router = require('express').Router();

router.post('/users', user.createUser);
router.post('/users/login', user.loginUser);

module.exports = router;


