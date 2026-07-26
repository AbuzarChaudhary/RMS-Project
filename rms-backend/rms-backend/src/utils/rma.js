// RMA id generation + return-window eligibility.
const ORDER_ID_REGEX = /^ORD-\d{8}-\d{4}$/;

function returnWindowDays() {
  return Number(process.env.RETURN_WINDOW_DAYS) || 30;
}

function isValidOrderId(orderId) {
  return typeof orderId === 'string' && ORDER_ID_REGEX.test(orderId.trim());
}

// e.g. "PM382489LS" — 2 letters + 6 digits + 2 letters
function generateRmaId() {
  const L = () => String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const digits = Math.floor(Math.random() * 1e6).toString().padStart(6, '0');
  return `${L()}${L()}${digits}${L()}${L()}`;
}

// "today" — real date, or REFERENCE_DATE from .env (handy for the 2025 sample data)
function today() {
  const ref = process.env.REFERENCE_DATE;
  const d = ref ? new Date(`${ref}T00:00:00`) : new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function checkEligibility(receivedDateStr) {
  const received = new Date(`${receivedDateStr}T00:00:00`);
  const elapsedDays = Math.floor((today().getTime() - received.getTime()) / 86400000);
  const windowDays = returnWindowDays();
  const daysRemaining = windowDays - elapsedDays;
  return { eligible: daysRemaining >= 0, elapsedDays, daysRemaining, windowDays };
}

module.exports = { isValidOrderId, generateRmaId, checkEligibility, returnWindowDays };
