import api from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

function withCurrentLanguage(params = {}) {
  return {
    ...params,
    lang: params.lang || localStorage.getItem('language') || 'en',
  };
}

export const artifactsApi = {
  getAll: (params) => api.get(API_ENDPOINTS.artifacts.list, { params: withCurrentLanguage(params) }),
  getById: (id, params) => api.get(API_ENDPOINTS.artifacts.details(id), { params: withCurrentLanguage(params) }),
  getFavorites: () => api.get(API_ENDPOINTS.favorites.list),
  addFavorite: (monumentId) => api.post(API_ENDPOINTS.favorites.add, { monument_id: monumentId }),
  removeFavorite: (favoriteId) => api.delete(API_ENDPOINTS.favorites.remove(favoriteId)),
};
