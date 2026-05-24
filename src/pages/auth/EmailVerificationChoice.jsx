import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MailCheck, ShieldCheck, Timer } from 'lucide-react';
import verificationBg from '../../assets/images/email-verification-bg.png';
import { ROUTES } from '../../constants/routes';
import '../../styles/email-verification-choice.css';

export default function EmailVerificationChoice() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || 'example@gmail.com';
  const options = location.state?.options || [24, 68, 91];

  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(120);

  const correctOption = useMemo(() => options[1], [options]);

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formattedTime = `${Math.floor(timeLeft / 60)}:${String(
    timeLeft % 60
  ).padStart(2, '0')}`;

  const hiddenEmail = email.replace(/(.{2}).+(@.+)/, '$1****$2');

  const handleVerify = async () => {
    if (!selectedOption) {
      setErrorMessage('Please choose a verification number.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));

      if (selectedOption !== correctOption) {
        setErrorMessage('Incorrect verification number.');
        setIsLoading(false);
        return;
      }

      navigate(ROUTES.SIGN_IN);
    } catch (error) {
      setErrorMessage('Verification failed. Please try again.');
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
        Register
      </Link>

      <p className="evc-brand">KHEMET</p>

      <p className="evc-session">
        <Timer size={16} />
        Verification expires in <strong>{formattedTime}</strong>
      </p>

      <section className="evc-card">
        <div className="evc-icon">
          <MailCheck size={34} />
        </div>

        <h1>Email Verification</h1>

        <p className="evc-description">
          We sent a secure verification number to your email address.
          Select the correct number below to activate your account.
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
          {isLoading ? 'Verifying...' : 'Verify Account'}
        </button>

        <button className="evc-resend" type="button">
          Resend Verification Number
        </button>
      </section>
    </main>
  );
}