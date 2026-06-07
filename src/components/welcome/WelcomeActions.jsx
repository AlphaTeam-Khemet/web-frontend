import { Globe2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';

const languages = [
  { value: 'ar', label: 'Arabic' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'de', label: 'German' },
  { value: 'ru', label: 'Russian' },
  { value: 'fr', label: 'French' },
  { value: 'zh', label: 'Chinese' },
];

export default function WelcomeActions({ onSignIn, onGuest }) {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  return (
    <div className="welcome-actions">
      <button className="welcome-btn primary" onClick={onSignIn}>
        {t('auth.signIn')}
      </button>

      <label className="welcome-language">
        <span>
          <Globe2 size={16} />
          {t('auth.language')}
        </span>

        <select
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
        >
          {languages.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <button className="welcome-btn secondary" onClick={onGuest}>
        {t('auth.continueAsGuest')}
      </button>
    </div>
  );
}
