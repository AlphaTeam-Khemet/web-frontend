import { createContext, useContext, useMemo, useState } from 'react';
import { storage } from '../utils/storage';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUserState] = useState(storage.getUser());
  const [token, setTokenState] = useState(storage.getToken());
  const [isGuest, setIsGuest] = useState(false);
  const login = ({ user, token }) => { storage.setUser(user); storage.setToken(token); setUserState(user); setTokenState(token); setIsGuest(false); };
  const continueAsGuest = () => { storage.clearAuth(); setUserState(null); setTokenState(null); setIsGuest(true); };
  const logout = () => { storage.clearAuth(); setUserState(null); setTokenState(null); setIsGuest(false); };
  const value = useMemo(() => ({ user, token, isGuest, isAuthenticated: Boolean(token), login, continueAsGuest, logout }), [user, token, isGuest]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuthContext() { const context = useContext(AuthContext); if (!context) throw new Error('useAuthContext must be used inside AuthProvider'); return context; }
