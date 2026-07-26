const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { httpError } = require('../middleware/errorHandler');
const { driveImageUrl } = require('../utils/image');
const { generateRmaId, isValidOrderId, checkEligibility } = require('../utils/rma');

const REASONS = {
  not_fit: 'Item did not fit',
  wrong_item: 'Received the wrong item',
  not_like: 'Did not like the item',
  defected: 'The item is defected',
};

// GET /api/exchanges/recommendations?item=:orderItemId
// Suggests active products for an exchange (excludes the item being returned).
exports.getRecommendations = asyncHandler(async (req, res) => {
  const orderItemId = Number(req.query.item);
  let excludeProductId = null;
  if (orderItemId) {
    const [[oi]] = await pool.query('SELECT product_id FROM order_items WHERE order_item_id = ? LIMIT 1', [orderItemId]);
    if (oi) excludeProductId = oi.product_id;
  }
  const [rows] = await pool.query(
    `SELECT product_id, product_name, category, brand, price, color, image_url, size_options
       FROM products
      WHERE is_active = TRUE ${excludeProductId ? 'AND product_id <> ?' : ''}
      ORDER BY RAND() LIMIT 3`,
    excludeProductId ? [excludeProductId] : []
  );
  res.json({
    recommendations: rows.map((p) => ({
      productId: p.product_id,
      name: p.product_name,
      category: p.category,
      brand: p.brand,
      price: Number(p.price),
      color: p.color,
      imageUrl: driveImageUrl(p.image_url),
      sizeOptions: p.size_options ? p.size_options.split(',') : [],
    })),
  });
});

// POST /api/exchanges   body: { orderId, orderItemId, reasonCode, exchangeProductId?, exchangeSize? }
exports.createExchange = asyncHandler(async (req, res) => {
  const { orderId, orderItemId, reasonCode, exchangeProductId, exchangeSize } = req.body;
  if (!isValidOrderId(orderId)) throw httpError(400, 'Invalid Order ID format.');
  if (!orderItemId) throw httpError(400, 'orderItemId is required.');
  if (!REASONS[reasonCode]) throw httpError(400, 'Invalid reason.');

  const [[item]] = await pool.query(
    `SELECT oi.order_item_id, oi.product_id, o.customer_id, o.received_date
       FROM order_items oi
       JOIN orders o ON o.order_id = oi.order_id
      WHERE oi.order_id = ? AND oi.order_item_id = ? LIMIT 1`,
    [orderId, Number(orderItemId)]
  );
  if (!item) throw httpError(404, 'That item was not found on the given order.');
  if (!checkEligibility(item.received_date).eligible) throw httpError(422, 'This order is outside the return window.');

  const rmaId = generateRmaId();
  const [result] = await pool.query(
    `INSERT INTO return_requests
       (rma_id, order_id, order_item_id, product_id, customer_id, request_type, reason_code, reason, exchange_product_id, exchange_size)
     VALUES (?, ?, ?, ?, ?, 'exchange', ?, ?, ?, ?)`,
    [rmaId, orderId, item.order_item_id, item.product_id, item.customer_id, reasonCode, REASONS[reasonCode],
     exchangeProductId ? Number(exchangeProductId) : null, exchangeSize || null]
  );
  res.status(201).json({ returnId: result.insertId, rmaId, requestType: 'exchange', status: 'pending' });
});
