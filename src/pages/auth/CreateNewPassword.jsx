import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, LockKeyhole } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PasswordInput from '../../components/auth/PasswordInput';
import PasswordStrength from '../../components/auth/PasswordStrength';
import createPasswordBg from '../../assets/images/create-new-password-bg.png';
import { ROUTES } from '../../constants/routes';
import { authApi } from '../../api/authApi';
import { getApiErrorMessage } from '../../utils/apiData';
import '../../styles/create-new-password.css';

export default function CreateNewPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const email = location.state?.email || '';
  const code = location.state?.code || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (newPassword.length < 8) {
      setErrorMessage(t('auth.errors.passwordMin'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(t('auth.errors.passwordMismatch'));
      return;
    }

    setIsLoading(true);

    try {
      await authApi.resetPassword({
        email,
        otp: code,
        new_password: newPassword,
      });

      navigate(ROUTES.SIGN_IN);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, t('auth.errors.generic')));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="cnp-page">
      <img src={createPasswordBg} alt="" className="cnp-bg" />
      <div className="cnp-overlay" />
      <div className="cnp-pattern" />

      

      <p className="cnp-brand">KHEMET</p>

      <section className="cnp-card">
        <div className="cnp-icon">
          <LockKeyhole size={30} />
        </div>

        <h1>{t('auth.createNewPassword')}</h1>

        <p className="cnp-subtitle">
          {t('auth.createNewPasswordSubtitle')}
        </p>

        <form onSubmit={handleSubmit}>
          <PasswordInput
            label={t('auth.newPassword')}
            value={newPassword}
            onChange={setNewPassword}
            placeholder={t('auth.newPasswordPlaceholder')}
            showPassword={showNewPassword}
            onToggle={() => setShowNewPassword((prev) => !prev)}
          />

          <PasswordInput
            label={t('auth.confirmPassword')}
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder={t('auth.confirmPasswordPlaceholder')}
            showPassword={showConfirmPassword}
            onToggle={() => setShowConfirmPassword((prev) => !prev)}
          />

          <PasswordStrength password={newPassword} />

          {errorMessage && (
            <p className="cnp-error">{errorMessage}</p>
          )}

          <button className="cnp-submit" type="submit" disabled={isLoading}>
            {isLoading ? t('common.loading') : t('auth.savePassword')}
          </button>
        </form>

        <Link to={ROUTES.SIGN_IN} className="cnp-bottom-link">
          <ArrowLeft size={17} />
          {t('auth.backToSignIn')}
        </Link>
      </section>

      <footer className="cnp-footer">
        <p>
          <LockKeyhole size={16} />
          {t('auth.vaultSecurity')}
        </p>

        <div>
          <a href="#">{t('auth.privacy')}</a>
          <a href="#">{t('auth.terms')}</a>
          <a href="#">{t('auth.contactSupport')}</a>
        </div>
      </footer>
    </main>
  );
}
