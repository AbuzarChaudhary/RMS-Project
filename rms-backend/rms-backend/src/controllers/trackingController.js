const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { httpError } = require('../middleware/errorHandler');

const STAGES = [
  { key: 'received', label: 'Received' },
  { key: 'in_transit', label: 'In Transit' },
  { key: 'inspected', label: 'Inspected' },
  { key: 'restocked', label: 'Restocked' },
];

// GET /api/tracking/:rmaId
exports.getStatus = asyncHandler(async (req, res) => {
  const rmaId = String(req.params.rmaId).trim();
  const [[row]] = await pool.query(
    `SELECT r.rma_id, r.status, r.tracking_stage, o.shipping_address, c.phone
       FROM return_requests r
       JOIN orders o    ON o.order_id = r.order_id
       JOIN customers c ON c.customer_id = r.customer_id
      WHERE r.rma_id = ? LIMIT 1`,
    [rmaId]
  );
  if (!row) throw httpError(404, 'No return found with that RMA ID.');

  const currentIndex = STAGES.findIndex((s) => s.key === row.tracking_stage);
  const timeline = STAGES.map((s, i) => ({ stage: s.key, label: s.label, done: i <= currentIndex }));
  const orderStatus =
    row.status === 'completed' ? 'Completed' :
    row.status === 'rejected'  ? 'Rejected'  : 'In Progress';

  res.json({
    rmaId: row.rma_id,
    status: row.status,
    orderStatus,
    trackingStage: row.tracking_stage,
    timeline,
    receiverAddress: row.shipping_address,
    phone: row.phone,
  });
});
