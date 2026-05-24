export const API_ENDPOINTS = {
  auth: { login: '/auth/login', register: '/auth/register', me: '/auth/me', forgotPassword: '/auth/forgot-password', resetPassword: '/auth/reset-password' },
  artifacts: { list: '/artifacts', details: (id) => `/artifacts/${id}`, favorites: '/favorites' },
  translation: { upload: '/translation/upload', result: (id) => `/translation/${id}` },
  user: { profile: '/user/profile', settings: '/user/settings' },
};
