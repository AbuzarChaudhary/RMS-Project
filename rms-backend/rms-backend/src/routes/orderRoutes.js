const router = require('express').Router();
const ctrl = require('../controllers/orderController');

router.get('/:orderId', ctrl.getOrderById);

module.exports = router;
