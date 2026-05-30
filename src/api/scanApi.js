import api from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

function createImageForm(file) {
  const formData = new FormData();
  formData.append('image', file);
  return formData;
}

export const scanApi = {
  scanArtifact: (file) => api.post(API_ENDPOINTS.scan.artifact, createImageForm(file), {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  translateImage: (file) => api.post(API_ENDPOINTS.scan.translate, createImageForm(file), {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getHistory: () => api.get(API_ENDPOINTS.scan.history),
};
