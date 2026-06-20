import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';
export default function GuestRoute() {
  const { isAuthenticated, user } = useAuth();
  
  if (isAuthenticated) {
    if (user && user.email_verified === false) {
      return <Navigate to={ROUTES.EMAIL_VERIFICATION_CHOICE} replace />;
    }
    return <Navigate to={ROUTES.HOME} replace />;
  }
  
  return <Outlet />;
}
