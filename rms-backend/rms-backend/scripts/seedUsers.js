// Creates the Admin and Staff login accounts (idempotent).
// Run with:  npm run seed
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('../src/config/db');

const USERS = [
  { full_name: 'Admin User', email: 'admin@rms.com', password: 'admin123', role: 'admin' },
  { full_name: 'Staff User', email: 'staff@rms.com', password: 'staff123', role: 'staff' },
  { full_name: 'Warehouse User', email: 'warehouse@rms.com', password: 'warehouse123', role: 'warehouse' },
];

(async () => {
  for (const u of USERS) {
    const hash = await bcrypt.hash(u.password, 10);
    await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), password_hash = VALUES(password_hash), role = VALUES(role)`,
      [u.full_name, u.email.toLowerCase(), hash, u.role]
    );
    console.log(`Seeded ${u.role}: ${u.email} / ${u.password}`);
  }
  await pool.end();
  console.log('Users seeded.');
})().catch((e) => { console.error(e); process.exit(1); });
