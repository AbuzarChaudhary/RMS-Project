import { axiosClient } from '@/services/api/axiosClient';
import { ENDPOINTS } from '@/services/api/endpoints';

// Admin dashboard + staff queue API.
export const adminService = {
  getMetrics: () => axiosClient.get(ENDPOINTS.admin.metrics).then((r) => r.data),
  listRequests: (params) => axiosClient.get(ENDPOINTS.admin.requests, { params }).then((r) => r.data),
  decideRequest: (rmaId, decision) =>
    axiosClient.patch(ENDPOINTS.admin.decision(rmaId), { decision }).then((r) => r.data),
};
