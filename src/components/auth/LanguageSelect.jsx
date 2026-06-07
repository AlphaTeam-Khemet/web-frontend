import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { value: 'ar', label: 'Arabic' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'de', label: 'German' },
  { value: 'ru', label: 'Russian' },
  { value: 'fr', label: 'French' },
  { value: 'zh', label: 'Chinese' },
];

export default function LanguageSelect({ value, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="register-field">
      <label>{t('auth.language')}</label>

      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">{t('auth.selectLanguage')}</option>

        {LANGUAGES.map((language) => (
          <option key={language.value} value={language.value}>
            {language.label}
          </option>
        ))}
      </select>
    </div>
  );
}
