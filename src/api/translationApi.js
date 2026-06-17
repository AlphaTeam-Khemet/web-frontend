import api from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
export const translationApi = {
  uploadImage: (formData) => api.post(API_ENDPOINTS.translation.upload, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};
