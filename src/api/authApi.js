import api from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
export const authApi = {
  login: (payload) => api.post(API_ENDPOINTS.auth.login, payload),
  register: (payload) => api.post(API_ENDPOINTS.auth.register, payload),
  me: () => api.get(API_ENDPOINTS.auth.me),
  forgotPassword: (payload) => api.post(API_ENDPOINTS.auth.forgotPassword, payload),
  resetPassword: (payload) => api.post(API_ENDPOINTS.auth.resetPassword, payload),
};
