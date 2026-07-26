const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { httpError } = require('../middleware/errorHandler');
const { driveImageUrl } = require('../utils/image');
const { isValidOrderId, checkEligibility } = require('../utils/rma');

// GET /api/orders/:orderId
// Validates the Order ID, then returns the order, its customer, and its items.
exports.getOrderById = asyncHandler(async (req, res) => {
  const orderId = String(req.params.orderId || '').trim();
  if (!isValidOrderId(orderId)) {
    throw httpError(400, 'Invalid Order ID format. Expected: ORD-YYYYMMDD-NNNN.');
  }

  const [orderRows] = await pool.query(
    `SELECT o.order_id, o.customer_id, o.order_date, o.received_date, o.total_amount,
            o.payment_method, o.order_status, o.shipping_address,
            c.full_name, c.phone, c.email, c.city
       FROM orders o
       JOIN customers c ON c.customer_id = o.customer_id
      WHERE o.order_id = ? LIMIT 1`,
    [orderId]
  );
  const order = orderRows[0];
  if (!order) throw httpError(404, 'No order found with that Order ID.');

  const eligibility = checkEligibility(order.received_date);

  const [items] = await pool.query(
    `SELECT oi.order_item_id, oi.product_id, oi.quantity, oi.size_ordered, oi.color_ordered, oi.unit_price,
            p.product_name, p.category, p.brand, p.image_url, p.size_options
       FROM order_items oi
       JOIN products p ON p.product_id = oi.product_id
      WHERE oi.order_id = ?`,
    [orderId]
  );

  res.json({
    order: {
      orderId: order.order_id,
      orderDate: order.order_date,
      receivedDate: order.received_date,
      totalAmount: Number(order.total_amount),
      paymentMethod: order.payment_method,
      status: order.order_status,
      shippingAddress: order.shipping_address,
      eligible: eligibility.eligible,
      daysRemaining: eligibility.daysRemaining,
      returnWindowDays: eligibility.windowDays,
      customer: {
        id: order.customer_id, name: order.full_name,
        phone: order.phone, email: order.email, city: order.city,
      },
    },
    items: items.map((it) => ({
      orderItemId: it.order_item_id,
      productId: it.product_id,
      name: it.product_name,
      category: it.category,
      brand: it.brand,
      color: it.color_ordered,
      size: it.size_ordered,
      quantity: it.quantity,
      unitPrice: Number(it.unit_price),
      imageUrl: driveImageUrl(it.image_url),
      sizeOptions: it.size_options ? it.size_options.split(',') : [],
    })),
  });
});
