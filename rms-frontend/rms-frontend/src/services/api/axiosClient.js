import axios from 'axios';
import { ENV } from '@/config/env';
import { tokenStore } from './tokenStore';

// Pre-configured axios instance shared by every service module.
export const axiosClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach the JWT (if we have one) to every request.
axiosClient.interceptors.request.use((config) => {
  const token = tokenStore.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token is missing/expired, clear it so the app returns to a logged-out state.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) tokenStore.clear();
    return Promise.reject(error);
  }
);
