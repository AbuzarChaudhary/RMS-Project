const router = require('express').Router();
const ctrl = require('../controllers/authController');
const { authRequired } = require('../middleware/auth');

router.post('/login', ctrl.login);
router.post('/logout', ctrl.logout);
router.get('/me', authRequired, ctrl.me);

module.exports = router;
