const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { httpError } = require('../middleware/errorHandler');
const { driveImageUrl } = require('../utils/image');

// GET /api/admin/metrics   — aggregates for the admin dashboard
exports.getMetrics = asyncHandler(async (req, res) => {
  const [[totals]] = await pool.query(
    `SELECT COUNT(*) AS total,
            SUM(status IN ('pending','accepted')) AS active,
            SUM(status = 'completed')             AS completed
       FROM return_requests`
  );
  const [byItem] = await pool.query(
    `SELECT p.category AS label, COUNT(*) AS value
       FROM return_requests r JOIN products p ON p.product_id = r.product_id
      GROUP BY p.category ORDER BY value DESC`
  );
  const [byLocation] = await pool.query(
    `SELECT c.city AS label, COUNT(*) AS value
       FROM return_requests r JOIN customers c ON c.customer_id = r.customer_id
      GROUP BY c.city ORDER BY value DESC`
  );
  const [monthly] = await pool.query(
    `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS value
       FROM return_requests GROUP BY month ORDER BY month`
  );

  res.json({
    totals: {
      total: Number(totals.total) || 0,
      active: Number(totals.active) || 0,
      completed: Number(totals.completed) || 0,
    },
    byItem: byItem.map((r) => ({ label: r.label, value: Number(r.value) })),
    byLocation: byLocation.map((r) => ({ label: r.label, value: Number(r.value) })),
    monthly: monthly.map((r) => ({ month: r.month, value: Number(r.value) })),
  });
});

// GET /api/admin/requests?status=&search=   — the staff work queue
exports.listRequests = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  const where = [];
  const params = [];
  if (status && ['pending', 'accepted', 'rejected', 'completed'].includes(status)) {
    where.push('r.status = ?'); params.push(status);
  }
  if (search) { where.push('r.rma_id LIKE ?'); params.push(`%${search}%`); }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `SELECT r.return_id, r.rma_id, r.request_type, r.reason, r.status, r.refund_amount,
            p.product_name, p.image_url, oi.color_ordered, oi.size_ordered, oi.unit_price
       FROM return_requests r
       JOIN products p     ON p.product_id = r.product_id
       JOIN order_items oi ON oi.order_item_id = r.order_item_id
       ${whereSql}
      ORDER BY r.created_at DESC`,
    params
  );
  res.json({
    requests: rows.map((r) => ({
      returnId: r.return_id,
      rmaId: r.rma_id,
      requestType: r.request_type,
      productName: r.product_name,
      imageUrl: driveImageUrl(r.image_url),
      color: r.color_ordered,
      size: r.size_ordered,
      price: Number(r.unit_price),
      reason: r.reason,
      status: r.status,
    })),
  });
});

// PATCH /api/admin/requests/:rmaId/decision   body: { decision: 'accept' | 'reject' }
exports.decideRequest = asyncHandler(async (req, res) => {
  const rmaId = String(req.params.rmaId).trim();
  const { decision } = req.body;
  if (!['accept', 'reject'].includes(decision)) throw httpError(400, "decision must be 'accept' or 'reject'.");
  const newStatus = decision === 'accept' ? 'accepted' : 'rejected';
  const [r] = await pool.query(
    "UPDATE return_requests SET status = ? WHERE rma_id = ? AND status = 'pending'",
    [newStatus, rmaId]
  );
  if (r.affectedRows === 0) throw httpError(404, 'No pending return found with that RMA ID.');
  res.json({ rmaId, status: newStatus });
});
