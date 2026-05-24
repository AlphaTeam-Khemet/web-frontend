export const ROUTES = {
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  FORGOT_PASSWORD: "/forgot-password",
  VERIFICATION_CODE: '/verification-code',
  HOME: "/home",
  COLLECTIONS: "/collections",
  ARTIFACT_DETAILS: '/artifact-details/:id',
  MEDIA_GALLERY: "/media-gallery",
  TRANSLATE: "/translate",
  FAVORITES: "/favorites",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  WELCOME: "/welcome",
  CREATE_NEW_PASSWORD: '/create-new-password',
  EMAIL_VERIFICATION_CHOICE: '/email-verification-choice',
};

export const getArtifactDetailsRoute = (id) => `/artifact-details/${id}`;
