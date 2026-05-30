import api from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
export const authApi = {
  login: (payload) => api.post(API_ENDPOINTS.auth.login, payload),
  register: (payload) => api.post(API_ENDPOINTS.auth.register, payload),
  refresh: (payload) => api.post(API_ENDPOINTS.auth.refresh, payload),
  logout: (payload) => api.post(API_ENDPOINTS.auth.logout, payload),
  forgotPassword: (payload) => api.post(API_ENDPOINTS.auth.forgotPassword, payload),
  verifyResetOtp: (payload) => api.post(API_ENDPOINTS.auth.verifyResetOtp, payload),
  resetPassword: (payload) => api.post(API_ENDPOINTS.auth.resetPassword, payload),
};
