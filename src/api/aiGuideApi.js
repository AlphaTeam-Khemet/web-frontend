import api from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const aiGuideApi = {
  health: () => api.get(API_ENDPOINTS.aiGuide.health),
  ask: ({ question, topic }) => api.post(API_ENDPOINTS.aiGuide.ask, { question, topic }),
  describe: ({ monument_name }) => api.post(API_ENDPOINTS.aiGuide.describe, { monument_name }),
  identify: ({ monument_name, question }) => api.post(API_ENDPOINTS.aiGuide.identify, { monument_name, question }),
};
