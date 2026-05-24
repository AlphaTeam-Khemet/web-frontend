import api from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
export const artifactsApi = {
  getAll: (params) => api.get(API_ENDPOINTS.artifacts.list, { params }),
  getById: (id) => api.get(API_ENDPOINTS.artifacts.details(id)),
  getFavorites: () => api.get(API_ENDPOINTS.artifacts.favorites),
  toggleFavorite: (artifactId) => api.post(API_ENDPOINTS.artifacts.favorites, { artifactId }),
};
