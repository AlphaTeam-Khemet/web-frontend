import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

export default function GuestRoute() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    if (user && user.email_verified === false) {
      // Store the user's real email so EmailVerificationChoice can display the
      // correct masked address instead of the 'example@gmail.com' placeholder.
      // Only write if sessionStorage doesn't already have fresh data (e.g. from
      // a just-completed registration).
      const existing = sessionStorage.getItem('verification_data');
      if (!existing && user.email) {
        sessionStorage.setItem(
          'verification_data',
          JSON.stringify({ email: user.email, maskedEmail: '', options: [] })
        );
      }
      return <Navigate to={ROUTES.EMAIL_VERIFICATION_CHOICE} replace />;
    }
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
}
