import { createContext, useContext, useMemo, useState } from 'react';
import { authService } from '@/services/authService';
import { tokenStore } from '@/services/api/tokenStore';

const AuthContext = createContext(null);

/**
 * Auth provider. `user` is { id, name, email, role } once signed in.
 * login() calls the backend for the SELECTED role, stores the returned JWT,
 * and keeps the session across reloads. Admin and staff stay separate because
 * the backend only authenticates each account for its own role.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => tokenStore.getUser());

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login: async ({ role, email, password }) => {
        try {
          const data = await authService.login({ email, password, role });
          tokenStore.setToken(data.token);
          tokenStore.setUser(data.user);
          setUser(data.user);
          return { ok: true, user: data.user };
        } catch (err) {
          const msg =
            err?.response?.data?.error ||
            'Unable to sign in. Make sure the backend server is running.';
          return { ok: false, error: msg };
        }
      },
      logout: () => {
        authService.logout();
        tokenStore.clear();
        setUser(null);
      },
      setUser,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
