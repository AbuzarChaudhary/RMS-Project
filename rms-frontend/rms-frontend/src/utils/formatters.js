// Shared formatting helpers.
export const formatCurrency = (amount, currency = 'Rs') =>
  `${currency} ${Number(amount ?? 0).toLocaleString()}`;

export const formatDate = (value) => {
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString();
};
