import api from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
export const userApi = {
  getProfile: () => api.get(API_ENDPOINTS.user.profile),
  updateProfile: (payload) => api.put(API_ENDPOINTS.user.profile, payload),
};
