export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    sendEmailVerification: '/auth/send-email-verification',
    verifyEmail: '/auth/verify-email',
    resendEmailVerification: '/auth/resend-email-verification',
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
  hieroglyph: {
    health: '/hieroglyph/health',
    translate: '/hieroglyph/translate',
    detectOnly: '/hieroglyph/detect-only',
  },
  translation: {
    upload: '/hieroglyph/translate',
  },
  voice: {
    health: '/voice/health',
    narrate: '/voice/narrate',
    narrateArtifact: (artifactId) => `/voice/artifacts/${artifactId}/narrate`,
    audio: (filename) => `/voice/audio/${filename}`,
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
