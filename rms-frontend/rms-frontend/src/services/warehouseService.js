import { axiosClient } from '@/services/api/axiosClient';
import { ENDPOINTS } from '@/services/api/endpoints';

// Warehouse flow API (inbound returns -> inspection -> restock).
export const warehouseService = {
  listInbound: () => axiosClient.get(ENDPOINTS.warehouse.inbound).then((r) => r.data),
  inspectItem: (rmaId, payload) =>
    axiosClient.post(ENDPOINTS.warehouse.inspect(rmaId), payload).then((r) => r.data),
  restock: (payload) => axiosClient.post(ENDPOINTS.warehouse.restock, payload).then((r) => r.data),
};
