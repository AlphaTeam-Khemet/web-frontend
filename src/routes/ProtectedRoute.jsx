import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

export default function ProtectedRoute() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Guests and unauthenticated users are both redirected to sign-in.
    // Pass the current location so sign-in can redirect back after login.
    return <Navigate to={ROUTES.SIGN_IN} state={{ from: location }} replace />;
  }

  if (user && user.email_verified === false) {
    // Store the user's real email so EmailVerificationChoice can display the
    // correct masked address instead of the placeholder.
    const existing = sessionStorage.getItem('verification_data');
    if (!existing && user.email) {
      sessionStorage.setItem(
        'verification_data',
        JSON.stringify({ email: user.email, maskedEmail: '', options: [] })
      );
    }
    return <Navigate to={ROUTES.EMAIL_VERIFICATION_CHOICE} replace />;
  }

  return <Outlet />;
}
