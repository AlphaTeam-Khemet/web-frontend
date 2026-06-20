import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
import { aiGuideApi } from '../api/aiGuideApi';
import { getApiErrorMessage, normalizeUser } from '../utils/apiData';

import '../styles/settings.css';

const languageLabels = {
  en: 'English',
  ar: 'Arabic',
  fr: 'French',
  de: 'German',
  ru: 'Russian',
  es: 'Spanish',
  zh: 'Chinese',
};

export default function Settings() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { favoritesCount } = useFavorites();
  const { user, updateAvatar, updateProfile, clearUser } = useUserProfile();
  const { user: authUser, isAuthenticated, logout } = useAuth();
  const { language } = useLanguage();
  const [scansCount, setScansCount] = useState(0);
  const [chatsCount, setChatsCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    let active = true;

    async function loadBackendProfile() {
      if (!isAuthenticated) return;

      try {
        const [{ data: profile }, { data: scans }, { data: conversations }] = await Promise.all([
          userApi.getProfile(),
          scanApi.getHistory(),
          aiGuideApi.getConversations(),
        ]);

        if (!active) return;

        updateProfile({ name: normalizeUser(profile).name });
        setScansCount(Array.isArray(scans) ? scans.length : 0);
        setChatsCount(Array.isArray(conversations) ? conversations.length : 0);
      } catch {
        if (active) {
          setStatusMessage(
            'Signed in, but profile activity could not be refreshed.'
          );
        }
      }
    }

    loadBackendProfile();

    return () => {
      active = false;
    };
  }, [isAuthenticated, updateProfile]);

  const profileUser =
    isAuthenticated && authUser
      ? {
          ...user,
          name: authUser.name || user.name,
          email: authUser.email || user.email,
        }
      : user;

  const handleLogout = async () => {
    await logout();
    clearUser();
    navigate('/welcome');
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      t('settings.security.deleteConfirm')
    );

    if (!confirmed) return;

    try {
      alert(t('settings.security.deleteSuccess'));
      navigate('/');
    } catch {
      alert(t('settings.security.deleteError'));
    }
  };

  const handleUpdateProfile = async (nextProfile) => {
    try {
      if (isAuthenticated) {
        const { data } = await userApi.updateProfile({
          full_name: nextProfile.name,
        });

        updateProfile({ name: normalizeUser(data).name });
      } else {
        updateProfile(nextProfile);
      }

      setStatusMessage(t('common.saveChanges'));
    } catch (error) {
      setStatusMessage(
        getApiErrorMessage(error, 'Unable to update profile.')
      );
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
            chatsCount={chatsCount}
            scansCount={scansCount}
          />
        </div>

        <SettingsContent
          user={profileUser}
          onUpdateProfile={handleUpdateProfile}
          onDeleteAccount={handleDeleteAccount}
        />

        {statusMessage && (
          <div className="scan-save-message">
            {statusMessage}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
