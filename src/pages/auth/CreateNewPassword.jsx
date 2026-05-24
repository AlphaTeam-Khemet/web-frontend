import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, LockKeyhole, Timer } from 'lucide-react';
import PasswordInput from '../../components/auth/PasswordInput';
import PasswordStrength from '../../components/auth/PasswordStrength';
import createPasswordBg from '../../assets/images/create-new-password-bg.png';
import { ROUTES } from '../../constants/routes';
import '../../styles/create-new-password.css';

export default function CreateNewPassword() {
  const navigate = useNavigate();
  const location = useLocation();

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
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace mock with:
      // await authApi.resetPassword({ email, code, newPassword })

      await new Promise((resolve) => setTimeout(resolve, 900));

      navigate(ROUTES.SIGN_IN);
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="cnp-page">
      <img src={createPasswordBg} alt="" className="cnp-bg" />
      <div className="cnp-overlay" />
      <div className="cnp-pattern" />

      <Link to={ROUTES.SIGN_IN} className="cnp-top-link">
        <span>
          <ArrowLeft size={18} />
        </span>
        Sign In
      </Link>

      <p className="cnp-brand">KHEMET</p>

      <p className="cnp-session">
        <Timer size={16} />
        Session: <strong>3m 27s</strong>
      </p>

      <section className="cnp-card">
        <div className="cnp-icon">
          <LockKeyhole size={30} />
        </div>

        <h1>Create New Password</h1>

        <p className="cnp-subtitle">
          Your new password must be different from the previous one.
        </p>

        <form onSubmit={handleSubmit}>
          <PasswordInput
            label="NEW PASSWORD"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="Enter your new password"
            showPassword={showNewPassword}
            onToggle={() => setShowNewPassword((prev) => !prev)}
          />

          <PasswordInput
            label="CONFIRM PASSWORD"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Confirm your new password"
            showPassword={showConfirmPassword}
            onToggle={() => setShowConfirmPassword((prev) => !prev)}
          />

          <PasswordStrength password={newPassword} />

          {errorMessage && (
            <p className="cnp-error">{errorMessage}</p>
          )}

          <button className="cnp-submit" type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Password'}
          </button>
        </form>

        <Link to={ROUTES.SIGN_IN} className="cnp-bottom-link">
          <ArrowLeft size={17} />
          Back to Sign In
        </Link>
      </section>

      <footer className="cnp-footer">
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