import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import forgotBg from '../../assets/images/forgot-bg.png';
import { ROUTES } from '../../constants/routes';
import { authApi } from '../../api/authApi';
import { getApiErrorMessage } from '../../utils/apiData';
import '../../styles/forgot-password.css';
export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');
    setErrorMessage('');

    try {
      const { data } = await authApi.forgotPassword({ email });
      setMessage(data.message || 'If this email exists, a password reset code has been sent.');

      setTimeout(() => {
        navigate(ROUTES.VERIFICATION_CODE, {
          state: { email },
        });
      }, 900);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Something went wrong. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="forgot-page">
      <img src={forgotBg} alt="" className="forgot-bg" />
      <div className="forgot-overlay" />

      

      <section className="forgot-card">
        <div className="forgot-icon">
          <Mail size={34} />
        </div>

        <p className="forgot-kicker">ACCOUNT RECOVERY</p>

        <h1>Recover Your Access</h1>

        <p className="forgot-subtitle">
          Enter your email address and we’ll send you a secure reset code.
        </p>

        <form className="forgot-form" onSubmit={handleSubmit}>
          <div className="forgot-field">
            <label htmlFor="email">EMAIL ADDRESS</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setMessage('');
                setErrorMessage('');
              }}
              required
            />
          </div>

          {message && <p className="forgot-success">{message}</p>}
          {errorMessage && <p className="forgot-error">{errorMessage}</p>}

          <button className="forgot-submit" type="submit" disabled={isLoading}>
            {isLoading ? 'Sending Code...' : 'Send Reset Code'}
          </button>
        </form>

        <p className="forgot-note">
          Remember your password? <Link to={ROUTES.SIGN_IN}>Sign In</Link>
        </p>
      </section>
    </main>
  );
}
