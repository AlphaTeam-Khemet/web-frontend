import api from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const aiGuideApi = {
  health: () => api.get(API_ENDPOINTS.aiGuide.health),
  ask: ({ question, topic, conversation_id }) =>
    api.post(API_ENDPOINTS.aiGuide.ask, { question, topic, conversation_id }),
  getConversations: () => api.get(API_ENDPOINTS.aiGuide.conversations),
  getConversationMessages: (id) => api.get(API_ENDPOINTS.aiGuide.conversationMessages(id)),
  updateConversationTitle: (id, { title }) =>
    api.patch(API_ENDPOINTS.aiGuide.conversationTitle(id), { title }),
  deleteConversation: (id) => api.delete(API_ENDPOINTS.aiGuide.deleteConversation(id)),
  describe: ({ monument_name }) => api.post(API_ENDPOINTS.aiGuide.describe, { monument_name }),
  identify: ({ monument_name, question }) => api.post(API_ENDPOINTS.aiGuide.identify, { monument_name, question }),
};
