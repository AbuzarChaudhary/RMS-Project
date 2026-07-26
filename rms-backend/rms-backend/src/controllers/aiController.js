const asyncHandler = require('../utils/asyncHandler');
const { detectDamage } = require('../services/roboflow');

// POST /api/ai/verify-defect   (multipart form with an "image" file)
// Runs the uploaded photo through the Roboflow damage-detection workflow.
// If the model can't be reached (offline, quota, misconfig), it degrades
// gracefully so the customer's return can still proceed.
exports.verifyDefect = asyncHandler(async (req, res) => {
  if (!req.file || !req.file.buffer || !req.file.buffer.length) {
    return res.json({
      defectDetected: null,
      confidence: null,
      message: 'No photo was provided, so the AI check was skipped. You can still continue.',
      fileReceived: false,
    });
  }
  try {
    const result = await detectDamage(req.file.buffer);
    res.json({ ...result, fileReceived: true });
  } catch (err) {
    console.error('[ai/verify-defect] Roboflow call failed:', err.message);
    res.json({
      defectDetected: null,
      confidence: null,
      message: 'The AI damage check is unavailable right now — you can still continue.',
      fileReceived: true,
      error: err.message,
    });
  }
});
