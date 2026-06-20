import api from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const voiceApi = {
  health: () => api.get(API_ENDPOINTS.voice.health),
  narrate: (payload) => api.post(API_ENDPOINTS.voice.narrate, payload, { timeout: 60000 }),
  narrateArtifact: (artifactId, payload) =>
    api.post(API_ENDPOINTS.voice.narrateArtifact(artifactId), payload, { timeout: 90000 }),
  getAudio: (filename) => api.get(API_ENDPOINTS.voice.audio(filename), {
    responseType: 'blob',
    timeout: 60000,
  }),
};
