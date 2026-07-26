const router = require('express').Router();
const ctrl = require('../controllers/trackingController');

router.get('/:rmaId', ctrl.getStatus);

module.exports = router;
