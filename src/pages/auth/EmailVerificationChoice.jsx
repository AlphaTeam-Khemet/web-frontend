import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MailCheck, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import verificationBg from '../../assets/images/email-verification-bg.png';
import { ROUTES } from '../../constants/routes';
import '../../styles/email-verification-choice.css';

export default function EmailVerificationChoice() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const email = location.state?.email || 'example@gmail.com';
  const options = location.state?.options || [24, 68, 91];

  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const correctOption = useMemo(() => options[1], [options]);

  const hiddenEmail = email.replace(/(.{2}).+(@.+)/, '$1****$2');

  const handleVerify = async () => {
    if (!selectedOption) {
      setErrorMessage(t('auth.errors.chooseVerification'));
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));

      if (selectedOption !== correctOption) {
        setErrorMessage(t('auth.errors.incorrectVerification'));
        setIsLoading(false);
        return;
      }

      navigate(ROUTES.SIGN_IN);
    } catch (error) {
      setErrorMessage(t('auth.errors.verificationFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="evc-page">
      <img src={verificationBg} alt="" className="evc-bg" />

      <div className="evc-overlay" />
      <div className="evc-pattern" />

      <Link to={ROUTES.SIGN_UP} className="evc-top-link">
        <span>
          <ArrowLeft size={18} />
        </span>
        {t('auth.register')}
      </Link>

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
          disabled={isLoading}
        >
          {isLoading ? t('auth.verifying') : t('auth.verify')}
        </button>

        <button className="evc-resend" type="button">
          {t('auth.resendVerificationNumber')}
        </button>
      </section>
    </main>
  );
}
