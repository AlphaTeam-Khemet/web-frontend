import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import TermsCheckbox from './TermsCheckbox';
import PasswordStrength from './PasswordStrength';
import { ROUTES } from '../../constants/routes';
import { authApi } from '../../api/authApi';
import { getApiErrorMessage } from '../../utils/apiData';
import { useLanguage } from '../../context/LanguageContext';
import { useAuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const backendLanguageIds = {
  en: 1,
  ar: 2,
  de: 3,
  fr: 4,
  es: 5,
  zh: 6,
  ru: 7,
};

export default function RegisterForm() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { login } = useAuthContext();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const validatePassword = (password) => {
    const hasCapital = /[A-Z]/.test(password);
    const hasSmall = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasUnderscore = /_/.test(password);
    const hasLength = password.length >= 8;

    return hasCapital && hasSmall && hasNumber && hasUnderscore && hasLength;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setErrorMessage(t('auth.errors.required'));
      return;
    }

    if (!validatePassword(formData.password)) {
      setErrorMessage(
        t('auth.errors.passwordRules')
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage(t('auth.errors.passwordMismatch'));
      return;
    }

    if (!acceptedTerms) {
      setErrorMessage(t('auth.errors.acceptTerms'));
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await authApi.register({
        full_name: formData.fullName.trim(),
        email: formData.email,
        password: formData.password,
        preferred_language: backendLanguageIds[language] || backendLanguageIds.en,
      });
      sessionStorage.setItem('verification_data', JSON.stringify({
        email: formData.email,
        maskedEmail: data?.masked_email,
        options: data?.options,
      }));
      login(data);
      // Navigate directly — don't wait for GuestRoute to detect the state change.
      navigate(ROUTES.EMAIL_VERIFICATION_CHOICE);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, t('auth.errors.emailRegistered')));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="register-card">
      <h1>{t('auth.signUp')}</h1>

      <p className="register-subtitle">
        {t('auth.signUpSubtitle')}
      </p>

      <form onSubmit={handleSubmit}>
        <div className="register-field">
          <label>{t('auth.fullName')}</label>
          <input
            type="text"
            placeholder={t('auth.fullNamePlaceholder')}
            value={formData.fullName}
            onChange={(event) => updateField('fullName', event.target.value)}
          />
        </div>

        <div className="register-field">
          <label>{t('auth.email')}</label>
          <input
            type="email"
            placeholder={t('auth.emailPlaceholder')}
            value={formData.email}
            onChange={(event) => updateField('email', event.target.value)}
          />
        </div>

        <div className="register-field">
          <label>{t('auth.password')}</label>
          <div className="register-password">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={t('auth.createPasswordPlaceholder')}
              value={formData.password}
              onChange={(event) => updateField('password', event.target.value)}
            />

            <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <PasswordStrength password={formData.password} />

        <div className="register-field">
          <label>{t('auth.confirmPassword')}</label>
          <div className="register-password">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder={t('auth.confirmPasswordPlaceholder')}
              value={formData.confirmPassword}
              onChange={(event) =>
                updateField('confirmPassword', event.target.value)
              }
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <TermsCheckbox checked={acceptedTerms} onChange={setAcceptedTerms} />

        <div className="register-captcha">
          <ShieldCheck size={16} />
          {t('auth.captcha')}
        </div>

        {errorMessage && <p className="register-error">{errorMessage}</p>}

        <button className="register-submit" type="submit" disabled={isLoading}>
          {isLoading ? t('auth.creatingAccount') : t('auth.signUp')}
          <ArrowRight size={18} />
        </button>
      </form>

      <p className="register-login">
        {t('auth.alreadyAccount')} <Link to={ROUTES.SIGN_IN}>{t('auth.signIn')}</Link>
      </p>
    </section>
  );
}
