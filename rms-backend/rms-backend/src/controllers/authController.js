const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { httpError } = require('../middleware/errorHandler');

// POST /api/auth/login   body: { email, password, role }
// Authenticates against the credentials for the SELECTED role only.
exports.login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) throw httpError(400, 'Email, password, and role are required.');
  if (!['admin', 'staff', 'warehouse'].includes(role)) throw httpError(400, 'Role must be admin, staff, or warehouse.');

  const [rows] = await pool.query(
    'SELECT user_id, full_name, email, password_hash, role FROM users WHERE email = ? AND role = ? LIMIT 1',
    [String(email).trim().toLowerCase(), role]
  );
  const user = rows[0];
  // Same message whether the email or the password is wrong (don't reveal which).
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw httpError(401, 'Invalid email or password for the selected role.');
  }

  const payload = { id: user.user_id, name: user.full_name, email: user.email, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
  res.json({ token, user: payload });
});

// GET /api/auth/me   (requires a valid token)
exports.me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

// POST /api/auth/logout   (stateless JWT — the client just discards the token)
exports.logout = asyncHandler(async (req, res) => {
  res.json({ ok: true });
});
