const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { httpError } = require('../middleware/errorHandler');
const { generateRmaId, isValidOrderId, checkEligibility } = require('../utils/rma');

const REASONS = {
  not_fit: 'Item did not fit',
  wrong_item: 'Received the wrong item',
  not_like: 'Did not like the item',
  defected: 'The item is defected',
};

// Load an order item and confirm its order exists and is still within the window.
async function loadEligibleItem(orderId, orderItemId) {
  const [rows] = await pool.query(
    `SELECT oi.order_item_id, oi.product_id, oi.unit_price, o.customer_id, o.received_date
       FROM order_items oi
       JOIN orders o ON o.order_id = oi.order_id
      WHERE oi.order_id = ? AND oi.order_item_id = ? LIMIT 1`,
    [orderId, orderItemId]
  );
  const item = rows[0];
  if (!item) throw httpError(404, 'That item was not found on the given order.');
  if (!checkEligibility(item.received_date).eligible) {
    throw httpError(422, 'This order is outside the return window and is no longer eligible.');
  }
  return item;
}

// POST /api/returns   body: { orderId, orderItemId, reasonCode, defectConfidence? }
exports.createReturn = asyncHandler(async (req, res) => {
  const { orderId, orderItemId, reasonCode, defectConfidence } = req.body;
  if (!isValidOrderId(orderId)) throw httpError(400, 'Invalid Order ID format.');
  if (!orderItemId) throw httpError(400, 'orderItemId is required.');
  if (!REASONS[reasonCode]) throw httpError(400, 'Invalid reason.');

  const item = await loadEligibleItem(orderId, Number(orderItemId));
  const rmaId = generateRmaId();

  const [result] = await pool.query(
    `INSERT INTO return_requests
       (rma_id, order_id, order_item_id, product_id, customer_id, request_type, reason_code, reason, refund_amount, defect_confidence)
     VALUES (?, ?, ?, ?, ?, 'return', ?, ?, ?, ?)`,
    [rmaId, orderId, item.order_item_id, item.product_id, item.customer_id, reasonCode, REASONS[reasonCode],
     Number(item.unit_price), defectConfidence != null ? Number(defectConfidence) : null]
  );

  res.status(201).json({
    returnId: result.insertId,
    rmaId,
    requestType: 'return',
    reason: REASONS[reasonCode],
    refundAmount: Number(item.unit_price),
    status: 'pending',
  });
});

// POST /api/returns/:returnId/refund-method   body: { method: 'bank_account' | 'store_credit' }
exports.setRefundMethod = asyncHandler(async (req, res) => {
  const returnId = Number(req.params.returnId);
  const { method } = req.body;
  if (!['bank_account', 'store_credit'].includes(method)) throw httpError(400, 'Invalid refund method.');

  const [r] = await pool.query('UPDATE return_requests SET refund_method = ? WHERE return_id = ?', [method, returnId]);
  if (r.affectedRows === 0) throw httpError(404, 'Return not found.');

  const [[row]] = await pool.query(
    'SELECT rma_id, refund_method, refund_amount FROM return_requests WHERE return_id = ?',
    [returnId]
  );
  res.json({ returnId, rmaId: row.rma_id, refundMethod: row.refund_method, refundAmount: Number(row.refund_amount) });
});

// POST /api/returns/:returnId/bank-details   body: { bankName, accountNumber, beneficiaryName }
exports.setBankDetails = asyncHandler(async (req, res) => {
  const returnId = Number(req.params.returnId);
  const { bankName, accountNumber, beneficiaryName } = req.body;
  if (!bankName || !accountNumber || !beneficiaryName) {
    throw httpError(400, 'Bank name, account number, and beneficiary name are required.');
  }
  const [r] = await pool.query(
    `UPDATE return_requests
        SET refund_method = COALESCE(refund_method, 'bank_account'),
            bank_name = ?, bank_account = ?, beneficiary_name = ?
      WHERE return_id = ?`,
    [bankName, accountNumber, beneficiaryName, returnId]
  );
  if (r.affectedRows === 0) throw httpError(404, 'Return not found.');
  res.json({ returnId, ok: true });
});

// GET /api/returns/:rmaId/receipt   — the e-receipt / RMA label data
exports.getReceipt = asyncHandler(async (req, res) => {
  const rmaId = String(req.params.rmaId).trim();
  const [[row]] = await pool.query(
    `SELECT r.rma_id, r.request_type, r.reason, r.status, r.created_at,
            o.order_id, o.shipping_address, c.full_name, c.phone, p.product_name
       FROM return_requests r
       JOIN orders o     ON o.order_id = r.order_id
       JOIN customers c  ON c.customer_id = r.customer_id
       JOIN products p   ON p.product_id = r.product_id
      WHERE r.rma_id = ? LIMIT 1`,
    [rmaId]
  );
  if (!row) throw httpError(404, 'No return found with that RMA ID.');
  res.json({
    rmaId: row.rma_id,
    requestType: row.request_type,
    productName: row.product_name,
    reason: row.reason,
    phone: row.phone,
    issueDate: row.created_at,
    receiverName: row.full_name,
    receiverAddress: row.shipping_address,
    status: row.status,
  });
});
