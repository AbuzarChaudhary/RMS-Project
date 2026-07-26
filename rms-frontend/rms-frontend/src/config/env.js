// Central place to read environment config (never read import.meta.env directly elsewhere).
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  AI_SERVICE_URL: import.meta.env.VITE_AI_SERVICE_URL ?? '',
  APP_ENV: import.meta.env.MODE,
};
