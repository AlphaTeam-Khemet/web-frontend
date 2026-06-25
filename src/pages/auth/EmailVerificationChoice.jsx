import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MailCheck, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import verificationBg from '../../assets/images/email-verification-bg.png';
import { ROUTES } from '../../constants/routes';
import { authApi } from '../../api/authApi';
import { getApiErrorMessage } from '../../utils/apiData';
import { useAuthContext } from '../../context/AuthContext';
import '../../styles/email-verification-choice.css';

export default function EmailVerificationChoice() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isAuthenticated, updateUser, logout } = useAuthContext();

  // Read sessionStorage BEFORE any effect removes it.
  const cachedData = JSON.parse(sessionStorage.getItem('verification_data') || 'null') || {};
  const stateData = location.state || cachedData;

  const email = stateData.email || '';
  const [maskedEmail, setMaskedEmail] = useState(stateData.maskedEmail || '');
  const [options, setOptions] = useState((stateData.options || []).map(String));

  useEffect(() => {
    // Remove after reading so a page refresh doesn't re-use stale data.
    sessionStorage.removeItem('verification_data');
  }, []);

  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const hiddenEmail = maskedEmail || email.replace(/(.{2}).+(@.+)/, '$1****$2');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.SIGN_IN, { replace: true });
      return;
    }

    if (options.length) return;

    let ignore = false;
    const loadVerificationOptions = async () => {
      try {
        const { data } = await authApi.sendEmailVerification();
        if (ignore) return;
        setMaskedEmail(data.masked_email || '');
        setOptions((data.options || []).map(String));
      } catch (error) {
        if (!ignore) {
          setErrorMessage(getApiErrorMessage(error, t('auth.errors.verificationFailed')));
        }
      }
    };

    loadVerificationOptions();

    return () => {
      ignore = true;
    };
  }, [isAuthenticated, navigate, options.length, t]);

  const handleVerify = async () => {
    if (!selectedOption) {
      setErrorMessage(t('auth.errors.chooseVerification'));
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const { data } = await authApi.verifyEmail({ otp: String(selectedOption) });
      if (data.user) updateUser(data.user);
      navigate(ROUTES.HOME);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, t('auth.errors.verificationFailed')));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setErrorMessage('');
    setSelectedOption(null);
    setIsResending(true);

    try {
      const { data } = await authApi.resendEmailVerification();
      setMaskedEmail(data.masked_email || '');
      setOptions((data.options || []).map(String));
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, t('auth.errors.verificationFailed')));
    } finally {
      setIsResending(false);
    }
  };

  // Logs out the current unverified session so the user can freely go back to
  // Sign In or Register without being trapped in the verification loop.
  const handleCancel = async () => {
    sessionStorage.removeItem('verification_data');
    await logout();
    navigate(ROUTES.SIGN_IN, { replace: true });
  };

  return (
    <main className="evc-page">
      <img src={verificationBg} alt="" className="evc-bg" />

      <div className="evc-overlay" />
      <div className="evc-pattern" />

      <button type="button" onClick={handleCancel} className="evc-top-link">
        <span>
          <ArrowLeft size={18} />
        </span>
        {t('auth.register')}
      </button>

      <p className="evc-brand">KHEMET</p>

      <section className="evc-card">
        <div className="evc-icon">
          <MailCheck size={34} />
        </div>

        <h1>{t('auth.emailVerification')}</h1>

        <p className="evc-description">
          {t('auth.emailVerificationDescription')}
        </p>

        <div className="evc-email">
          <ShieldCheck size={16} />
          {hiddenEmail}
        </div>

        <div className="evc-options">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={`evc-option ${
                selectedOption === option ? 'active' : ''
              }`}
              onClick={() => setSelectedOption(option)}
            >
              {option}
            </button>
          ))}
        </div>

        {errorMessage && (
          <p className="evc-error">{errorMessage}</p>
        )}

        <button
          className="evc-submit"
          onClick={handleVerify}
          disabled={isLoading || !options.length}
        >
          {isLoading ? t('auth.verifying') : t('auth.verify')}
        </button>

        <button
          className="evc-resend"
          type="button"
          onClick={handleResend}
          disabled={isLoading || isResending}
        >
          {isResending ? t('auth.verifying') : t('auth.resendVerificationNumber')}
        </button>
      </section>
    </main>
  );
}
