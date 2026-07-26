const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { httpError } = require('../middleware/errorHandler');
const { driveImageUrl } = require('../utils/image');

// GET /api/warehouse/inbound   — accepted returns not yet restocked
exports.listInbound = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT r.rma_id, r.request_type, r.tracking_stage, p.product_name, p.image_url, oi.color_ordered, oi.size_ordered
       FROM return_requests r
       JOIN products p     ON p.product_id = r.product_id
       JOIN order_items oi ON oi.order_item_id = r.order_item_id
      WHERE r.status = 'accepted' AND r.tracking_stage <> 'restocked'
      ORDER BY r.updated_at DESC`
  );
  res.json({
    inbound: rows.map((r) => ({
      rmaId: r.rma_id, requestType: r.request_type, stage: r.tracking_stage,
      productName: r.product_name, imageUrl: driveImageUrl(r.image_url), color: r.color_ordered, size: r.size_ordered,
    })),
  });
});

// POST /api/warehouse/inspect/:rmaId
exports.inspect = asyncHandler(async (req, res) => {
  const rmaId = String(req.params.rmaId).trim();
  const [r] = await pool.query(
    "UPDATE return_requests SET tracking_stage = 'inspected' WHERE rma_id = ? AND status = 'accepted'",
    [rmaId]
  );
  if (r.affectedRows === 0) throw httpError(404, 'No accepted return found with that RMA ID.');
  res.json({ rmaId, trackingStage: 'inspected' });
});

// POST /api/warehouse/restock   body: { rmaId }   — mark restocked + return stock
exports.restock = asyncHandler(async (req, res) => {
  const { rmaId } = req.body;
  if (!rmaId) throw httpError(400, 'rmaId is required.');

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [[ret]] = await conn.query(
      'SELECT return_id, product_id FROM return_requests WHERE rma_id = ? FOR UPDATE',
      [rmaId]
    );
    if (!ret) throw httpError(404, 'Return not found.');
    await conn.query(
      "UPDATE return_requests SET tracking_stage = 'restocked', status = 'completed' WHERE return_id = ?",
      [ret.return_id]
    );
    await conn.query('UPDATE products SET stock_quantity = stock_quantity + 1 WHERE product_id = ?', [ret.product_id]);
    await conn.commit();
    res.json({ rmaId, trackingStage: 'restocked', status: 'completed' });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
});
