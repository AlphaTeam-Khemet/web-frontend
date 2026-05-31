import api from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const galleryApi = {
  getAll: () => api.get(API_ENDPOINTS.gallery.list),
  add: (payload) => api.post(API_ENDPOINTS.gallery.add, payload),
  remove: (id) => api.delete(API_ENDPOINTS.gallery.remove(id)),
};
