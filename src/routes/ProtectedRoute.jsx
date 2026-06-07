import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';
export default function ProtectedRoute() {
  const { isAuthenticated, isGuest } = useAuth();

  return isAuthenticated || isGuest ? (
    <Outlet />
  ) : (
    <Navigate to={ROUTES.SIGN_IN} replace />
  );
}
