const router = require('express').Router();
const ctrl = require('../controllers/warehouseController');
const { authRequired, requireRole } = require('../middleware/auth');

router.use(authRequired, requireRole('admin', 'staff', 'warehouse'));

router.get('/inbound', ctrl.listInbound);
router.post('/inspect/:rmaId', ctrl.inspect);
router.post('/restock', ctrl.restock);

module.exports = router;
