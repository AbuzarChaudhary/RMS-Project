const router = require('express').Router();
const multer = require('multer');
const ctrl = require('../controllers/aiController');

// Keep the uploaded photo in memory (we don't persist it in this demo).
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

router.post('/verify-defect', upload.single('image'), ctrl.verifyDefect);

module.exports = router;
