import { useNavigate } from 'react-router-dom';

import Footer from '../components/home/Footer';

import ProfileCard from '../components/settings/ProfileCard';
import ActivityStats from '../components/settings/ActivityStats';
import SettingsContent from '../components/settings/SettingsContent';

import { useFavorites } from '../context/FavoritesContext';
import { useUserProfile } from '../context/UserProfileContext';
import { useLanguage } from '../context/LanguageContext';

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
  const { user, updateAvatar, updateProfile } = useUserProfile();
  const { language } = useLanguage();

  const handleLogout = () => {
    /*
      Backend later:
      POST /auth/logout
      clear token
    */

    navigate('/');
  };

  const handleDeleteAccount = async () => {
  const confirmed = window.confirm(
    'Are you sure you want to delete your account? This action cannot be undone.'
  );

  if (!confirmed) return;

  try {
    /*
      Backend later:
      await api.delete('/users/me');
    */

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
            user={user}
            currentLanguage={languageLabels[language] || 'English'}
            onLogout={handleLogout}
            onAvatarChange={updateAvatar}
          />

          <ActivityStats
            favoritesCount={favoritesCount}
            chatsCount={0}
            scansCount={0}
          />
        </div>

        <SettingsContent
  user={user}
  onUpdateProfile={updateProfile}
  onDeleteAccount={handleDeleteAccount}
/>
      </section>
     

      <Footer />
    </main>
  );
}