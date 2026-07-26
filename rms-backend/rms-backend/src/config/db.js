require('dotenv').config();
const mysql = require('mysql2/promise');

// One shared connection pool for the whole app.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'COMPANY',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true, // return DATE / TIMESTAMP as plain strings
});

async function pingDb() {
  const conn = await pool.getConnection();
  try { await conn.ping(); } finally { conn.release(); }
}

module.exports = { pool, pingDb };
