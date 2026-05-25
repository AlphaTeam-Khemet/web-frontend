import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, LockKeyhole, Mail, RotateCcw, ShieldCheck } from 'lucide-react';
import OTPInput from '../../components/auth/OTPInput';
import verificationBg from '../../assets/images/verification-bg.png';
import { ROUTES } from '../../constants/routes';
import '../../styles/verification-code.css';

export default function VerificationCode() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || 'your-email@example.com';

  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(45);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const maskedEmail = useMemo(() => {
    const [name, domain] = email.split('@');
    if (!domain) return email;

    const visible = name.slice(0, 4);
    return `${visible}${'*'.repeat(Math.max(name.length - 4, 4))}@${domain}`;
  }, [email]);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (code.length !== 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace mock with:
      // await authApi.verifyResetCode({ email, code })
      await new Promise((resolve) => setTimeout(resolve, 900));

     navigate(ROUTES.CREATE_NEW_PASSWORD, {
  state: { email, code },
});
    } catch (error) {
      setErrorMessage('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    setTimer(45);
    setErrorMessage('');

    // TODO: Replace mock with:
    // await authApi.forgotPassword({ email })
  };

  return (
    <main className="verification-page">
      <img src={verificationBg} alt="" className="verification-bg" />
      <div className="verification-overlay" />
      <div className="verification-pattern" />

     

      <p className="verification-brand">KHEMET</p>

      <p className="verification-session">
        Session: 3m 27s
      </p>

      <section className="verification-card">
        <div className="verification-icon">
          <ShieldCheck size={34} />
        </div>

        <h1>verification code</h1>

        <p className="verification-subtitle">
          We have sent a verification code (OTP) to your registered email.
          Enter the code to proceed.
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
            {isLoading ? 'Authenticating...' : 'Authenticate Scroll'}
            <LockKeyhole size={18} />
          </button>
        </form>

        <button
          type="button"
          className="verification-resend"
          onClick={handleResend}
          disabled={timer > 0}
        >
          <RotateCcw size={17} />
          Resend Code
          {timer > 0 && <span>({`00:${String(timer).padStart(2, '0')}`})</span>}
        </button>
      </section>

      <footer className="verification-footer">
        <p>
          <LockKeyhole size={16} />
          Secured by Khemet Vault Encryption
        </p>

        <div>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Support</a>
        </div>
      </footer>
    </main>
  );
}