import { Globe2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const languages = [
  { value: 'ar', label: 'Arabic' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'de', label: 'German' },
  { value: 'fr', label: 'French' },
  { value: 'zh', label: 'Chinese' },
];

export default function WelcomeActions({ onSignIn, onGuest }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="welcome-actions">
      <button className="welcome-btn primary" onClick={onSignIn}>
        SIGN IN
      </button>

      <label className="welcome-language">
        <span>
          <Globe2 size={16} />
          Preferred Language
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
        CONTINUE AS GUEST
      </button>
    </div>
  );
}
