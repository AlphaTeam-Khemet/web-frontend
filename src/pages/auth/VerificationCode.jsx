import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, LockKeyhole, Mail, RotateCcw, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import OTPInput from '../../components/auth/OTPInput';
import verificationBg from '../../assets/images/verification-bg.png';
import { ROUTES } from '../../constants/routes';
import { authApi } from '../../api/authApi';
import { getApiErrorMessage } from '../../utils/apiData';
import '../../styles/verification-code.css';

export default function VerificationCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const email = location.state?.email || 'your-email@example.com';

  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const maskedEmail = useMemo(() => {
    const [name, domain] = email.split('@');
    if (!domain) return email;

    const visible = name.slice(0, 4);
    return `${visible}${'*'.repeat(Math.max(name.length - 4, 4))}@${domain}`;
  }, [email]);

  const handleVerify = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (code.length !== 6) {
      setErrorMessage(t('auth.errors.fullCode'));
      return;
    }

    setIsLoading(true);

    try {
      await authApi.verifyResetOtp({ email, otp: code });

     navigate(ROUTES.CREATE_NEW_PASSWORD, {
  state: { email, code },
});
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, t('auth.errors.invalidCode')));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setErrorMessage('');

    try {
      await authApi.forgotPassword({ email });
    } catch {
      setErrorMessage(t('auth.errors.resendCode'));
    }
  };

  return (
    <main className="verification-page">
      <img src={verificationBg} alt="" className="verification-bg" />
      <div className="verification-overlay" />
      <div className="verification-pattern" />

     

      <p className="verification-brand">KHEMET</p>

      <section className="verification-card">
        <div className="verification-icon">
          <ShieldCheck size={34} />
        </div>

        <h1>{t('auth.verificationCode')}</h1>

        <p className="verification-subtitle">
          {t('auth.verificationSubtitle')}
        </p>

        <div className="verification-email">
          <Mail size={18} />
          <span>{maskedEmail}</span>
        </div>

        <form onSubmit={handleVerify}>
          <OTPInput value={code} onChange={setCode} length={6} />

          {errorMessage && (
            <p className="verification-error">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="verification-submit"
            disabled={isLoading}
          >
            {isLoading ? t('auth.authenticating') : t('auth.authenticate')}
            <LockKeyhole size={18} />
          </button>
        </form>

        <button
          type="button"
          className="verification-resend"
          onClick={handleResend}
        >
          <RotateCcw size={17} />
          {t('auth.resendCode')}
        </button>
      </section>

      <footer className="verification-footer">
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
