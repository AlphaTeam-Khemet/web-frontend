import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

import {
  Languages,
  ShieldCheck,
  Trash2,
  UserRoundPen,
  Save,
} from 'lucide-react';

import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'zh', label: '中文' },
];

export default function SettingsContent({
  user,
  onUpdateProfile,
  onDeleteAccount,
}) {
  const { i18n } = useTranslation();
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

    onUpdateProfile({
      name: cleanName,
    });

    setIsEditing(false);

    /*
      Backend later:
      PATCH /users/me
    */
  };

  return (
    <section className="settings-content">
      <div className="settings-main-card settings-hero-card">
        <div>
          <span>Khemet Settings</span>

          <h1>Manage your museum experience</h1>

          <p>
            Control your account, language, saved artifacts,
            scans, and AI chat activity from one elegant place.
          </p>
        </div>
      </div>

      <div className="settings-main-card">
        <div className="settings-card-title">
          <UserRoundPen size={22} />

          <div>
            <h3>Account Information</h3>

            <p>
              Your profile details used across the Khemet platform.
            </p>
          </div>
        </div>

        <div className="settings-profile-edit-grid">
          <div className="settings-input-box">
            <label>Full Name</label>

            <input
              type="text"
              value={name}
              disabled={!isEditing}
              onChange={(event) =>
                setName(event.target.value)
              }
            />
          </div>

          <div className="settings-input-box">
            <label>Email Address</label>

            <input
              type="email"
              value={user.email}
              disabled
            />
          </div>
        </div>

        <div className="settings-profile-actions">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveProfile}
            >
              <Save size={17} />
              Save Changes
            </button>
          )}
        </div>
      </div>

      <div className="settings-main-card">
        <div className="settings-card-title">
          <Languages size={22} />

          <div>
            <h3>Language Preferences</h3>

            <p>
              Choose the language used across the whole website.
            </p>
          </div>
        </div>

        <div className="settings-language-box">
          <label htmlFor="settings-language">
            Website Language
          </label>

          <select
            id="settings-language"
            value={language}
            onChange={handleLanguageChange}
          >
            {languages.map((language) => (
              <option
                key={language.code}
                value={language.code}
              >
                {language.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      

    
      <div className="settings-main-card danger">
  <div className="settings-card-title">
    <ShieldCheck size={22} />

    <div>
      <h3>Privacy & Security</h3>

      <p>
        Keep your Khemet account safe. Never share your private information,
        password, or verification codes with anyone.
      </p>
    </div>
  </div>

  <div className="settings-security-note">
    <ShieldCheck size={20} />

    <div>
      <strong>Protect your private data</strong>
      <p>
        Khemet will never ask you to share your password outside the official
        website. Always make sure you are using a trusted device before signing in.
      </p>
    </div>
  </div>

  <div className="settings-action-row delete">
    <div>
      <Trash2 size={19} />
      <span>Delete Account</span>
    </div>

    <button type="button" onClick={onDeleteAccount}>
      Delete
    </button>
  </div>
</div>
    </section>
  );
}