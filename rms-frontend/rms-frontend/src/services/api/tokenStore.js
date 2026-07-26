// Persists the auth token + user across page reloads (real app, so localStorage is fine).
const TOKEN_KEY = 'rms_token';
const USER_KEY = 'rms_user';

export const tokenStore = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (t) => localStorage.setItem(TOKEN_KEY, t),
  getUser: () => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
  },
  setUser: (u) => localStorage.setItem(USER_KEY, JSON.stringify(u)),
  clear: () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); },
};
