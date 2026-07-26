const router = require('express').Router();
const ctrl = require('../controllers/returnController');

router.post('/', ctrl.createReturn);
router.post('/:returnId/refund-method', ctrl.setRefundMethod);
router.post('/:returnId/bank-details', ctrl.setBankDetails);
router.get('/:rmaId/receipt', ctrl.getReceipt);

module.exports = router;
