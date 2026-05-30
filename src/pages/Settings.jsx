import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Footer from '../components/home/Footer';

import ProfileCard from '../components/settings/ProfileCard';
import ActivityStats from '../components/settings/ActivityStats';
import SettingsContent from '../components/settings/SettingsContent';

import { useFavorites } from '../context/FavoritesContext';
import { useUserProfile } from '../context/UserProfileContext';
import { useLanguage } from '../context/LanguageContext';
import useAuth from '../hooks/useAuth';
import { userApi } from '../api/userApi';
import { scanApi } from '../api/scanApi';
import { getApiErrorMessage, normalizeUser } from '../utils/apiData';

import '../styles/settings.css';

const languageLabels = {
  en: 'English',
  ar: 'العربية',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  zh: '中文',
};

export default function Settings() {
  const navigate = useNavigate();

  const { favoritesCount } = useFavorites();
  const { user, updateAvatar, updateProfile, clearUser } = useUserProfile();
  const { user: authUser, isAuthenticated, logout } = useAuth();
  const { language } = useLanguage();
  const [scansCount, setScansCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    let active = true;

    async function loadBackendProfile() {
      if (!isAuthenticated) return;

      try {
        const [{ data: profile }, { data: scans }] = await Promise.all([
          userApi.getProfile(),
          scanApi.getHistory(),
        ]);
        if (!active) return;
        updateProfile({ name: normalizeUser(profile).name });
        setScansCount(Array.isArray(scans) ? scans.length : 0);
      } catch {
        if (active) setStatusMessage('Signed in, but profile activity could not be refreshed.');
      }
    }

    loadBackendProfile();

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const profileUser = isAuthenticated && authUser
    ? { ...user, name: authUser.name || user.name, email: authUser.email || user.email }
    : user;

  const handleLogout = async () => {
    await logout();
    clearUser();
    navigate('/welcome');
  };

  const handleDeleteAccount = async () => {
  const confirmed = window.confirm(
    'Are you sure you want to delete your account? This action cannot be undone.'
  );

  if (!confirmed) return;

  try {
    alert('Your account has been deleted successfully.');

    navigate('/');
  } catch {
    alert('Failed to delete account. Please try again.');
  }
};

  return (
    <main className="settings-page">
      <section className="settings-container">
        <div className="settings-left-column">
          <ProfileCard
            user={profileUser}
            currentLanguage={languageLabels[language] || 'English'}
            onLogout={handleLogout}
            onAvatarChange={updateAvatar}
          />

          <ActivityStats
            favoritesCount={favoritesCount}
            chatsCount={0}
            scansCount={scansCount}
          />
        </div>

        <SettingsContent
  user={profileUser}
  onUpdateProfile={async (nextProfile) => {
    try {
      if (isAuthenticated) {
        const { data } = await userApi.updateProfile({ full_name: nextProfile.name });
        updateProfile({ name: normalizeUser(data).name });
      } else {
        updateProfile(nextProfile);
      }
      setStatusMessage('Profile updated successfully.');
    } catch (error) {
      setStatusMessage(getApiErrorMessage(error, 'Unable to update profile.'));
    }
  }}
  onDeleteAccount={handleDeleteAccount}
/>
        {statusMessage && <div className="scan-save-message">{statusMessage}</div>}
      </section>
     

      <Footer />
    </main>
  );
}
