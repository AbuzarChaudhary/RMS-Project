// Backend endpoint paths in one place, grouped by domain.
export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  orders: {
    byId: (orderId) => `/orders/${orderId}`,
  },
  returns: {
    create: '/returns',
    refundMethod: (returnId) => `/returns/${returnId}/refund-method`,
    bankDetails: (returnId) => `/returns/${returnId}/bank-details`,
    receipt: (rmaId) => `/returns/${rmaId}/receipt`,
  },
  exchange: {
    create: '/exchanges',
    recommendations: (itemId) => `/exchanges/recommendations?item=${itemId}`,
  },
  ai: {
    verifyDefect: '/ai/verify-defect',
  },
  tracking: {
    status: (rmaId) => `/tracking/${rmaId}`,
  },
  warehouse: {
    inbound: '/warehouse/inbound',
    inspect: (rmaId) => `/warehouse/inspect/${rmaId}`,
    restock: '/warehouse/restock',
  },
  admin: {
    metrics: '/admin/metrics',
    requests: '/admin/requests',
    decision: (rmaId) => `/admin/requests/${rmaId}/decision`,
  },
};
