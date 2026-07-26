const router = require('express').Router();

router.use('/auth', require('./authRoutes'));
router.use('/orders', require('./orderRoutes'));
router.use('/returns', require('./returnRoutes'));
router.use('/exchanges', require('./exchangeRoutes'));
router.use('/ai', require('./aiRoutes'));
router.use('/tracking', require('./trackingRoutes'));
router.use('/warehouse', require('./warehouseRoutes'));
router.use('/admin', require('./adminRoutes'));

module.exports = router;
