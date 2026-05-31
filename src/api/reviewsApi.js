import api from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const reviewsApi = {
  getByMonument: (monumentId) => api.get(API_ENDPOINTS.reviews.byMonument(monumentId)),
  add: (payload) => api.post(API_ENDPOINTS.reviews.add, payload),
  remove: (id) => api.delete(API_ENDPOINTS.reviews.remove(id)),
};
