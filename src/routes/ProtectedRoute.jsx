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
    return <Navigate to={ROUTES.EMAIL_VERIFICATION_CHOICE} replace />;
  }

  return <Outlet />;
}
