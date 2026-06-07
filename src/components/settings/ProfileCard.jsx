import { useRef } from 'react';
import { Camera, LogOut, Mail, Globe2, UserRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ProfileCard({
  user,
  currentLanguage,
  onLogout,
  onAvatarChange,
}) {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const handleAvatarUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    onAvatarChange(file);
    event.target.value = '';
  };

  return (
    <aside className="settings-profile-card">
      <div className="settings-profile-top">
        <div className="settings-avatar-wrapper">
          <div className="settings-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <UserRound size={42} />
            )}
          </div>

          <button
            type="button"
            className="settings-avatar-upload"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Change profile image"
          >
            <Camera size={16} />
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleAvatarUpload}
        />

        <h2>{user.name}</h2>

        <div className="settings-profile-email">
          <Mail size={15} />
          <span>{user.email}</span>
        </div>
      </div>

      <div className="settings-profile-info">
        <div>
          <Globe2 size={18} />
          <span>{t('settings.currentLanguage')}</span>
          <strong>{currentLanguage}</strong>
        </div>
      </div>

      <button
        type="button"
        className="settings-logout-btn"
        onClick={onLogout}
      >
        <LogOut size={18} />
        {t('common.logout')}
      </button>
    </aside>
  );
}
