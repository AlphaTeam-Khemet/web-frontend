import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { storage } from '../utils/storage';
import { authApi } from '../api/authApi';
import { normalizeUser } from '../utils/apiData';

// Decode a JWT payload without a library (no signature verification needed —
// we just want the exp claim to decide whether to attempt a refresh).
function getJwtExpiry(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

function isTokenExpiredOrExpiringSoon(token, bufferMs = 60_000) {
  if (!token) return true;
  const expiry = getJwtExpiry(token);
  if (!expiry) return true;
  return Date.now() >= expiry - bufferMs;
}
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(storage.getUser());
  const [token, setTokenState] = useState(storage.getToken());
  const [isGuest, setIsGuest] = useState(storage.getGuest());
  // authReady gates rendering until we know whether the token is still valid.
  // Without this, ProtectedRoute renders before the silent refresh completes
  // and sees token=null, causing an unnecessary redirect to /sign-in.
  const [authReady, setAuthReady] = useState(false);

  // ── Silent token refresh on mount ───────────────────────────────────────────
  // The access token has a 15-min TTL. On page reload, localStorage may hold an
  // expired token. We silently attempt to refresh it using the 7-day refresh
  // token BEFORE any routes or API calls fire. If the refresh token is also
  // expired, we clear auth state so the user sees the sign-in page cleanly.
  useEffect(() => {
    let cancelled = false;

    async function silentRefresh() {
      const storedToken = storage.getToken();
      const storedRefresh = storage.getRefreshToken();

      if (storedToken && !isTokenExpiredOrExpiringSoon(storedToken)) {
        // Token is still valid — nothing to do.
        if (!cancelled) setAuthReady(true);
        return;
      }

      if (!storedRefresh) {
        // No refresh token — session truly expired; clear everything.
        storage.clearAuth();
        if (!cancelled) {
          setUserState(null);
          setTokenState(null);
          setIsGuest(false);
          setAuthReady(true);
        }
        return;
      }

      try {
        const { data } = await authApi.refresh({ refresh_token: storedRefresh });
        const newToken = data.access_token || data.token;
        storage.setToken(newToken);
        if (!cancelled) setTokenState(newToken);
      } catch {
        // Refresh token itself is expired or invalid — force logout cleanly.
        storage.clearAuth();
        if (!cancelled) {
          setUserState(null);
          setTokenState(null);
          setIsGuest(false);
        }
      } finally {
        if (!cancelled) setAuthReady(true);
      }
    }

    silentRefresh();
    return () => { cancelled = true; };
  }, []);

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

  // Don't render children until we know the auth state is settled.
  // This prevents a flash-of-wrong-route (e.g. redirect to /sign-in) while
  // the silent refresh is in flight.
  if (!authReady) return null;

  const value = { user, token, isGuest, isAuthenticated: Boolean(token), login, continueAsGuest, logout, updateUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuthContext() { const context = useContext(AuthContext); if (!context) throw new Error('useAuthContext must be used inside AuthProvider'); return context; }
