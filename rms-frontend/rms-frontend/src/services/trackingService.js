import { axiosClient } from '@/services/api/axiosClient';
import { ENDPOINTS } from '@/services/api/endpoints';

// RMA tracking API.
export const trackingService = {
  getStatus: (rmaId) => axiosClient.get(ENDPOINTS.tracking.status(rmaId)).then((r) => r.data),
};
