// Creates a handful of sample return/exchange records so the admin dashboard
// and staff panel have data to show on first run.  Run with:  npm run seed:data
require('dotenv').config();
const { pool } = require('../src/config/db');
const { generateRmaId } = require('../src/utils/rma');

const REASONS = [
  ['not_fit', 'Item did not fit'],
  ['wrong_item', 'Received the wrong item'],
  ['not_like', 'Did not like the item'],
  ['defected', 'The item is defected'],
];
const STATUSES = ['pending', 'accepted', 'completed', 'pending', 'completed', 'rejected', 'accepted', 'completed'];

(async () => {
  const [items] = await pool.query(
    `SELECT oi.order_item_id, oi.product_id, oi.unit_price, o.order_id, o.customer_id
       FROM order_items oi JOIN orders o ON o.order_id = oi.order_id
      LIMIT 8`
  );
  let n = 0;
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const [reason_code, reason] = REASONS[i % REASONS.length];
    const status = STATUSES[i % STATUSES.length];
    const type = i % 3 === 0 ? 'exchange' : 'return';
    const stage = status === 'completed' ? 'restocked' : status === 'accepted' ? 'inspected' : 'received';
    await pool.query(
      `INSERT INTO return_requests
         (rma_id, order_id, order_item_id, product_id, customer_id, request_type, reason_code, reason, refund_amount, status, tracking_stage)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [generateRmaId(), it.order_id, it.order_item_id, it.product_id, it.customer_id, type, reason_code, reason, Number(it.unit_price), status, stage]
    );
    n++;
  }
  await pool.end();
  console.log(`Seeded ${n} sample return requests.`);
})().catch((e) => { console.error(e); process.exit(1); });
