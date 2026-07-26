// Build an HTTP error carrying a status + a safe, user-facing message.
function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  err.expose = true;
  return err;
}

function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.expose ? err.message
    : status === 500 ? 'Something went wrong on the server.' : err.message;
  if (status === 500) console.error(err);
  res.status(status).json({ error: message });
}

module.exports = { httpError, notFound, errorHandler };
