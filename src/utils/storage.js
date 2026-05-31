const TOKEN_KEY = 'khemet_token';
const REFRESH_TOKEN_KEY = 'khemet_refresh_token';
const USER_KEY = 'khemet_user';
const GUEST_KEY = 'khemet_guest';
const LEGACY_GUEST_KEY = 'isGuest';
const USER_PROFILE_KEY = 'khemet-user-profile';
const CHAT_MESSAGES_KEY = 'khemet-chat-messages';
export const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token) => token ? localStorage.setItem(REFRESH_TOKEN_KEY, token) : localStorage.removeItem(REFRESH_TOKEN_KEY),
  removeRefreshToken: () => localStorage.removeItem(REFRESH_TOKEN_KEY),
  getGuest: () => localStorage.getItem(GUEST_KEY) === 'true',
  setGuest: (value) => value ? localStorage.setItem(GUEST_KEY, 'true') : localStorage.removeItem(GUEST_KEY),
  getUser: () => { const user = localStorage.getItem(USER_KEY); return user ? JSON.parse(user) : null; },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  removeUser: () => localStorage.removeItem(USER_KEY),
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(GUEST_KEY);
    localStorage.removeItem(LEGACY_GUEST_KEY);
    localStorage.removeItem(USER_PROFILE_KEY);
    sessionStorage.removeItem(CHAT_MESSAGES_KEY);
  },
};
