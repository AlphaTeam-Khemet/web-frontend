import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './styles/index.css';
import './i18n';
import { LanguageProvider } from './context/LanguageContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { UserProfileProvider } from './context/UserProfileContext';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  
  <LanguageProvider>
    <UserProfileProvider>
    <FavoritesProvider>
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
  </FavoritesProvider>
  </UserProfileProvider>
  </LanguageProvider>
);
