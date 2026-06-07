import { useTranslation } from 'react-i18next';

export default function TermsCheckbox({ checked, onChange }) {
  const { t } = useTranslation();

  return (
    <label className="register-terms">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />

      <span>
        {t('auth.termsPrefix')} <a href="#">{t('auth.terms')}</a>{' '}
        {t('auth.termsAnd')} <a href="#">{t('auth.privacy')}</a>.
      </span>
    </label>
  );
}
