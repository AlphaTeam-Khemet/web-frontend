export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    forgotPassword: '/auth/forgot-password',
    verifyResetOtp: '/auth/verify-reset-otp',
    resetPassword: '/auth/reset-password',
  },
  artifacts: {
    list: '/monuments',
    details: (id) => `/monuments/${id}`,
  },
  favorites: {
    list: '/favorites',
    add: '/favorites',
    remove: (id) => `/favorites/${id}`,
  },
  scan: {
    artifact: '/scan/artifact',
    translate: '/scan/translate',
    history: '/scan/history',
  },
  translation: {
    upload: '/scan/translate',
    result: (id) => `/scan/history/${id}`,
  },
  aiGuide: {
    health: '/ai-guide/health',
    ask: '/ai-guide/ask',
    conversations: '/ai-guide/conversations',
    conversationMessages: (id) => `/ai-guide/conversations/${id}/messages`,
    conversationTitle: (id) => `/ai-guide/conversations/${id}/title`,
    deleteConversation: (id) => `/ai-guide/conversations/${id}`,
    describe: '/ai-guide/describe',
    identify: '/ai-guide/identify',
  },
  gallery: {
    list: '/gallery',
    add: '/gallery',
    remove: (id) => `/gallery/${id}`,
  },
  reviews: {
    byMonument: (monumentId) => `/reviews/monument/${monumentId}`,
    add: '/reviews',
    remove: (id) => `/reviews/${id}`,
  },
  user: { profile: '/users/profile' },
};
