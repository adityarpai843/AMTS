const router = require('express').Router();
const authorization = require('../middlewares/auth');
const location = require('../controller/location');


router.get('/locations',location.getAllLocations);
router.post('/locations',[authorization],location.createLocation);
router.put('/locations/:id',[authorization],location.updateLocation);
router.delete('/locations/:id', [authorization],location.deleteLocation);

module.exports = router;
