import { axiosClient } from '@/services/api/axiosClient';
import { ENDPOINTS } from '@/services/api/endpoints';

// Return processing API (lookup -> create -> refund method -> receipt).
export const returnService = {
  lookupOrder: (orderId) => axiosClient.get(ENDPOINTS.orders.byId(orderId)).then((r) => r.data),
  createReturn: (payload) => axiosClient.post(ENDPOINTS.returns.create, payload).then((r) => r.data),
  submitRefundMethod: (returnId, payload) =>
    axiosClient.post(ENDPOINTS.returns.refundMethod(returnId), payload).then((r) => r.data),
  submitBankDetails: (returnId, payload) =>
    axiosClient.post(ENDPOINTS.returns.bankDetails(returnId), payload).then((r) => r.data),
  getReceipt: (rmaId) => axiosClient.get(ENDPOINTS.returns.receipt(rmaId)).then((r) => r.data),
};
