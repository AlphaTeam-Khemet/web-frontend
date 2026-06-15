import api from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

function createImageForm(file) {
  const formData = new FormData();
  formData.append('image', file);
  return formData;
}

export const scanApi = {
  scanArtifact: (file, lang = localStorage.getItem('language') || 'en') => api.post(API_ENDPOINTS.scan.artifact, createImageForm(file), {
    params: { lang },
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  translateImage: (file, lang = localStorage.getItem('language') || 'en') => api.post(API_ENDPOINTS.scan.translate, createImageForm(file), {
    params: { lang },
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  translateHieroglyph: (file, lang = localStorage.getItem('language') || 'en') => api.post(API_ENDPOINTS.scan.translate, createImageForm(file), {
    params: { lang },
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getHistory: (lang = localStorage.getItem('language') || 'en') => api.get(API_ENDPOINTS.scan.history, { params: { lang } }),
};

