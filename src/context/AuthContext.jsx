import { createContext, useContext, useMemo, useState } from 'react';
import { storage } from '../utils/storage';
import { authApi } from '../api/authApi';
import { normalizeUser } from '../utils/apiData';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUserState] = useState(storage.getUser());
  const [token, setTokenState] = useState(storage.getToken());
  const [isGuest, setIsGuest] = useState(storage.getGuest());

  const login = (response) => {
    const nextToken = response.access_token || response.token;
    const refreshToken = response.refresh_token;
    const nextUser = normalizeUser(response.user);

    storage.setUser(nextUser);
    storage.setToken(nextToken);
    storage.setRefreshToken(refreshToken);
    storage.setGuest(false);
    setUserState(nextUser);
    setTokenState(nextToken);
    setIsGuest(false);
  };

  const continueAsGuest = () => {
    storage.clearAuth();
    storage.setGuest(true);
    setUserState(null);
    setTokenState(null);
    setIsGuest(true);
  };

  const updateUser = (nextUser) => {
    const normalized = normalizeUser({ ...user, ...nextUser });
    storage.setUser(normalized);
    setUserState(normalized);
  };

  const logout = async () => {
    const refreshToken = storage.getRefreshToken();
    try {
      if (refreshToken) await authApi.logout({ refresh_token: refreshToken });
    } catch {
      // Logout should always clear local auth state even if the backend is unreachable.
    }

    storage.clearAuth();
    setUserState(null);
    setTokenState(null);
    setIsGuest(false);
  };

  const value = useMemo(() => ({ user, token, isGuest, isAuthenticated: Boolean(token), login, continueAsGuest, logout, updateUser }), [user, token, isGuest]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuthContext() { const context = useContext(AuthContext); if (!context) throw new Error('useAuthContext must be used inside AuthProvider'); return context; }
