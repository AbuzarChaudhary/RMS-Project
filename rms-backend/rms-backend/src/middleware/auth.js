const jwt = require('jsonwebtoken');
const { httpError } = require('./errorHandler');

// Require a valid JWT (sets req.user).
function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(httpError(401, 'Authentication required.'));
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    next();
  } catch {
    next(httpError(401, 'Invalid or expired token.'));
  }
}

// Require the logged-in user to have one of the given roles.
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(httpError(403, 'You do not have access to this resource.'));
    }
    next();
  };
}

module.exports = { authRequired, requireRole };
