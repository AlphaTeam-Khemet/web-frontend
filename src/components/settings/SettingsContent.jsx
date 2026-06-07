import { useEffect, useState } from 'react';
import { Languages, ShieldCheck, Trash2, UserRoundPen, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '../../context/LanguageContext';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'Arabic' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'ru', label: 'Russian' },
  { code: 'zh', label: 'Chinese' },
];

export default function SettingsContent({
  user,
  onUpdateProfile,
  onDeleteAccount,
}) {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);

  useEffect(() => {
    setName(user.name);
  }, [user.name]);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleSaveProfile = () => {
    const cleanName = name.trim();

    if (!cleanName) return;

    onUpdateProfile({ name: cleanName });
    setIsEditing(false);
  };

  return (
    <section className="settings-content">
      <div className="settings-main-card settings-hero-card">
        <div>
          <span>{t('settings.badge')}</span>
          <h1>{t('settings.title')}</h1>
          <p>{t('settings.description')}</p>
        </div>
      </div>

      <div className="settings-main-card">
        <div className="settings-card-title">
          <UserRoundPen size={22} />

          <div>
            <h3>{t('settings.account.title')}</h3>
            <p>{t('settings.account.description')}</p>
          </div>
        </div>

        <div className="settings-profile-edit-grid">
          <div className="settings-input-box">
            <label>{t('settings.account.fullName')}</label>

            <input
              type="text"
              value={name}
              disabled={!isEditing}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="settings-input-box">
            <label>{t('settings.account.email')}</label>

            <input type="email" value={user.email} disabled />
          </div>
        </div>

        <div className="settings-profile-actions">
          {!isEditing ? (
            <button type="button" onClick={() => setIsEditing(true)}>
              {t('settings.account.editProfile')}
            </button>
          ) : (
            <button type="button" onClick={handleSaveProfile}>
              <Save size={17} />
              {t('common.saveChanges')}
            </button>
          )}
        </div>
      </div>

      <div className="settings-main-card">
        <div className="settings-card-title">
          <Languages size={22} />

          <div>
            <h3>{t('settings.language.title')}</h3>
            <p>{t('settings.language.description')}</p>
          </div>
        </div>

        <div className="settings-language-box">
          <label htmlFor="settings-language">
            {t('settings.language.websiteLanguage')}
          </label>

          <select
            id="settings-language"
            value={language}
            onChange={handleLanguageChange}
          >
            {languages.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="settings-main-card danger">
        <div className="settings-card-title">
          <ShieldCheck size={22} />

          <div>
            <h3>{t('settings.security.title')}</h3>
            <p>{t('settings.security.description')}</p>
          </div>
        </div>

        <div className="settings-security-note">
          <ShieldCheck size={20} />

          <div>
            <strong>{t('settings.security.noteTitle')}</strong>
            <p>{t('settings.security.noteText')}</p>
          </div>
        </div>

        <div className="settings-action-row delete">
          <div>
            <Trash2 size={19} />
            <span>{t('settings.security.deleteAccount')}</span>
          </div>

          <button type="button" onClick={onDeleteAccount}>
            {t('common.delete')}
          </button>
        </div>
      </div>
    </section>
  );
}
