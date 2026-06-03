const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api').replace(/\/api\/?$/, '');

export function getApiErrorMessage(error, fallback = 'Request failed. Please try again.') {
  return error?.response?.data?.message || error?.response?.data?.error || error?.message || fallback;
}

export function getFileUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path) || path.startsWith('data:')) return path;
  return `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}

export function normalizeUser(user = {}) {
  return {
    id: user.id,
    name: user.full_name || user.name || 'KHEMET User',
    full_name: user.full_name || user.name || 'KHEMET User',
    email: user.email || '',
    preferredLanguage: user.preferred_language || user.preferredLanguage || 'en',
    avatar: user.avatar || '',
  };
}

export function normalizeMonument(monument = {}) {
  const name = monument.name || monument.ai_label || 'Untitled Monument';
  const image = getFileUrl(monument.cover_image || monument.images?.[0]?.image_url);

  return {
    ...monument,
    id: monument.id,
    image,
    name,
    displayName: name,
    titleKey: name,
    category: monument.category || monument.era || 'Monuments',
    categoryKey: monument.category || monument.era || 'Monuments',
    period: monument.era || 'Ancient Egypt',
    periodKey: monument.era || 'Ancient Egypt',
    location: 'Grand Egyptian Museum',
    locationKey: 'Grand Egyptian Museum',
    description: monument.description || 'No description is available yet.',
    descriptionKey: monument.description || 'No description is available yet.',
    historyKey: monument.fun_facts?.length ? monument.fun_facts.join(' ') : monument.description,
    images: (monument.images || []).map((imageItem) => ({
      ...imageItem,
      image_url: getFileUrl(imageItem.image_url),
    })),
  };
}

export function normalizeScanResult(scanResponse = {}) {
  const monument = normalizeMonument(scanResponse.monument || {});
  const aiResult = scanResponse.ai_result || {};
  const confidence = Number(aiResult.confidence || scanResponse.session?.confidence || 0);
  const confidencePercent = confidence <= 1 ? Math.round(confidence * 100) : Math.round(confidence);

  return {
    raw: scanResponse,
    sessionId: scanResponse.session?.id,
    name: monument.name || scanResponse.mapped_monument_name || aiResult.class_name || 'Unknown artifact',
    category: monument.category || aiResult.class_name || 'AI Recognition',
    confidence: Number.isFinite(confidencePercent) ? confidencePercent : 0,
    period: monument.period || 'Ancient Egypt',
    description:
      scanResponse.ai_guide_description ||
      monument.description ||
      scanResponse.message ||
      'The artifact was scanned, but no detailed description was returned.',
    monument,
    aiResult,
  };
}
