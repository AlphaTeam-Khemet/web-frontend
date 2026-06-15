import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useAuthContext } from '../../context/AuthContext';
import { storage } from '../../utils/storage';

export default function AuthInterceptor() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthContext();

  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        const url = error.config?.url || '';
        const isAuthFlow = url.startsWith('/auth/login')
          || url.startsWith('/auth/register')
          || url.startsWith('/auth/forgot-password')
          || url.startsWith('/auth/verify-reset-otp')
          || url.startsWith('/auth/reset-password');

        if (status === 401 && !isAuthFlow) {
          // Clear context state without making a network request if possible,
          // but logout() will safely fail if it can't reach the backend.
          // Directly clearing storage and navigating is best to avoid infinite loops.
          storage.clearAuth();
          
          if (location.pathname !== '/sign-in') {
            navigate('/sign-in');
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptorId);
    };
  }, [navigate, location.pathname, logout]);

  return null;
}
