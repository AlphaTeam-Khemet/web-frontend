const LANGUAGES = [
  { value: 'ar', label: 'Arabic' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'de', label: 'German' },
  { value: 'fr', label: 'French' },
  { value: 'zh', label: 'Chinese' },
];

export default function LanguageSelect({ value, onChange }) {
  return (
    <div className="register-field">
      <label>Preferred Language</label>

      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Select language</option>

        {LANGUAGES.map((language) => (
          <option key={language.value} value={language.value}>
            {language.label}
          </option>
        ))}
      </select>
    </div>
  );
}