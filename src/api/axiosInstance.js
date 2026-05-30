import axios from 'axios';
import { storage } from '../utils/storage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    const isAuthFlow = url.startsWith('/auth/login')
      || url.startsWith('/auth/register')
      || url.startsWith('/auth/forgot-password')
      || url.startsWith('/auth/verify-reset-otp')
      || url.startsWith('/auth/reset-password');

    if (status === 401 && !isAuthFlow) {
      storage.clearAuth();

      if (typeof window !== 'undefined' && window.location.pathname !== '/sign-in') {
        window.location.assign('/sign-in');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
