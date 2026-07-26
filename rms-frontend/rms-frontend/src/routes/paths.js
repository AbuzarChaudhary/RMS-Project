// Single source of truth for every route string.
export const PATHS = {
  HOME: '/',

  // Customer return/exchange flow
  ORDER_ITEMS: '/order/items',
  ORDER_OPTIONS: '/order/options',

  RETURN_REASON: '/returns/reason',
  RETURN_PHOTO: '/returns/photo',
  RETURN_VERIFICATION: '/returns/verification',
  RETURN_REFUND_METHOD: '/returns/refund-method',
  RETURN_BANK_DETAILS: '/returns/bank-details',
  RETURN_CONFIRMATION: '/returns/confirmation',

  EXCHANGE_REASON: '/exchange/reason',
  EXCHANGE_SIZE: '/exchange/size',
  EXCHANGE_WRONG_ITEM: '/exchange/wrong-item',
  EXCHANGE_RECOMMENDATIONS: '/exchange/recommendations',

  RECEIPT: '/receipt',
  TRACK: '/track',
  TRACK_STATUS: '/track/status',

  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',

  STAFF_LOGIN: '/staff/login',
  STAFF_PANEL: '/staff/panel',
  STAFF_REQUEST_DETAILS: '/staff/requests/:rmaId',

  WAREHOUSE_LOGIN: '/warehouse/login',
  WAREHOUSE_INBOUND: '/warehouse/inbound',
  WAREHOUSE_INSPECTION: '/warehouse/inspection/:rmaId',
  WAREHOUSE_RESTOCK: '/warehouse/restock',

  NOT_FOUND: '*',
};
