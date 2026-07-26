const router = require('express').Router();
const ctrl = require('../controllers/exchangeController');

router.get('/recommendations', ctrl.getRecommendations);
router.post('/', ctrl.createExchange);

module.exports = router;
