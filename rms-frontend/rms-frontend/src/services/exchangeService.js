import { axiosClient } from '@/services/api/axiosClient';
import { ENDPOINTS } from '@/services/api/endpoints';

// Exchange API (recommended articles + exchange creation).
export const exchangeService = {
  getRecommendations: (itemId) =>
    axiosClient.get(ENDPOINTS.exchange.recommendations(itemId)).then((r) => r.data),
  createExchange: (payload) =>
    axiosClient.post(ENDPOINTS.exchange.create, payload).then((r) => r.data),
};
