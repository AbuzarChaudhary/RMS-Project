import { axiosClient } from '@/services/api/axiosClient';
import { ENDPOINTS } from '@/services/api/endpoints';
import { ROLES } from '@/constants/roles';

// Auth API (talks to the backend).
export const authService = {
  login: (credentials) => axiosClient.post(ENDPOINTS.auth.login, credentials).then((r) => r.data),
  logout: () => axiosClient.post(ENDPOINTS.auth.logout).then((r) => r.data).catch(() => ({ ok: true })),
  me: () => axiosClient.get(ENDPOINTS.auth.me).then((r) => r.data),
};

// Seeded demo accounts — shown as a hint on the login screen.
export const DEMO_CREDENTIALS = {
  [ROLES.ADMIN]: { email: 'admin@rms.com', password: 'admin123', name: 'Admin User' },
  [ROLES.STAFF]: { email: 'staff@rms.com', password: 'staff123', name: 'Staff User' },
};
