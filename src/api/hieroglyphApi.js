import api from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

function imageForm(file) {
  const formData = new FormData();
  formData.append('image', file);
  return formData;
}

export function normalizeHieroglyphResult(payload = {}) {
  const details = payload.translation_details || null;
  const symbols = payload.symbols || payload.detection?.symbol_sequence || [];
  const detections = payload.detections || payload.detection?.symbols || [];
  const translationText = typeof payload.translation === 'string'
    ? payload.translation
    : payload.translation?.text || payload.translation?.translation || '';

  return {
    ...payload,
    status: payload.success === false ? 'failed' : 'completed',
    detection: {
      ...(payload.detection || {}),
      symbols: detections,
      symbol_sequence: symbols,
      total_symbols: detections.length || symbols.length,
    },
    translation: translationText
      ? {
          ...(details || {}),
          text: translationText,
          transliteration: payload.transliteration || details?.transliteration || '',
          cultural_context: payload.cultural_context || details?.cultural_context || '',
        }
      : null,
  };
}

export const hieroglyphApi = {
  health: () => api.get(API_ENDPOINTS.hieroglyph.health),
  translate: (file) => api.post(
    API_ENDPOINTS.hieroglyph.translate,
    imageForm(file),
    { headers: { 'Content-Type': 'multipart/form-data' } }
  ),
  detectOnly: (file) => api.post(
    API_ENDPOINTS.hieroglyph.detectOnly,
    imageForm(file),
    { headers: { 'Content-Type': 'multipart/form-data' } }
  ),
};
