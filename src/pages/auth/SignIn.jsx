import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import authBg from '../../assets/images/auth-bg.png';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { authApi } from '../../api/authApi';
import { getApiErrorMessage } from '../../utils/apiData';
import '../../styles/auth.css';

export default function SignIn() {
  const navigate = useNavigate();
  const { login, continueAsGuest } = useAuth();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrorMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const { data } = await authApi.login(formData);
      login(data);
      navigate(ROUTES.HOME);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, t('auth.errors.invalidCredentials')));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    navigate(ROUTES.HOME);
  };

  return (
    <main className="auth-page">
      <img src={authBg} alt="" className="auth-bg" />
      <div className="auth-overlay" />

      <section className="signin-card">
        <h1>{t('auth.signIn')}</h1>
        <p className="signin-subtitle">
          {t('auth.signInSubtitle')}
        </p>

        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="signin-field">
            <label htmlFor="email">{t('auth.email')}</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="signin-field">
            <label htmlFor="password">{t('auth.password')}</label>

            <div className="password-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('auth.passwordPlaceholder')}
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="signin-options">
            <Link to={ROUTES.FORGOT_PASSWORD}>
              {t('auth.forgotPassword')}
            </Link>
          </div>

          {errorMessage && (
            <p className="signin-error">{errorMessage}</p>
          )}

          <button className="signin-submit" type="submit" disabled={isLoading}>
            {isLoading ? t('auth.signingIn') : t('auth.signIn')}
          </button>

          <div className="signin-divider">
            <span />
            <p>{t('auth.or')}</p>
            <span />
          </div>

          <button
            type="button"
            className="signin-guest"
            onClick={handleGuest}
          >
            {t('auth.continueAsGuest')}
          </button>

          <p className="signin-register">
            {t('auth.noAccount')}{' '}
            <Link to={ROUTES.SIGN_UP}>{t('auth.register')}</Link>
          </p>
        </form>
      </section>

      <footer className="auth-footer">
        <p>{t('auth.secureAuthentication')}</p>
        <div>
          <a href="#">{t('auth.privacy')}</a>
          <a href="#">{t('auth.terms')}</a>
        </div>
      </footer>
    </main>
  );
}
