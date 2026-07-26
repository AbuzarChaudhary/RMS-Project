const router = require('express').Router();
const dash = require('../controllers/dashboardController');
const { authRequired, requireRole } = require('../middleware/auth');

// Everything here needs a logged-in user.
router.use(authRequired);

router.get('/metrics', requireRole('admin'), dash.getMetrics);
router.get('/requests', requireRole('admin', 'staff'), dash.listRequests);
router.patch('/requests/:rmaId/decision', requireRole('admin', 'staff'), dash.decideRequest);

module.exports = router;
