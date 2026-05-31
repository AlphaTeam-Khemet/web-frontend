import api from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
export const artifactsApi = {
  getAll: (params) => api.get(API_ENDPOINTS.artifacts.list, { params }),
  getById: (id) => api.get(API_ENDPOINTS.artifacts.details(id)),
  getFavorites: () => api.get(API_ENDPOINTS.favorites.list),
  addFavorite: (monumentId) => api.post(API_ENDPOINTS.favorites.add, { monument_id: monumentId }),
  removeFavorite: (favoriteId) => api.delete(API_ENDPOINTS.favorites.remove(favoriteId)),
};
