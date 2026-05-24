import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import authBg from '../../assets/images/auth-bg.png';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import '../../styles/auth.css';

export default function SignIn() {
  const navigate = useNavigate();
  const { login, continueAsGuest } = useAuth();

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
      // TODO: Replace this mock logic with authApi.login(formData)
      // Expected API response:
      // {
      //   token: string,
      //   user: {
      //     id,
      //     name,
      //     email,
      //     preferredLanguage
      //   }
      // }

      const mockResponse = {
        token: 'mock-token',
        user: {
          id: 1,
          name: 'KHEMET User',
          email: formData.email,
          preferredLanguage: 'en',
        },
      };

      login(mockResponse);
      navigate(ROUTES.HOME);
    } catch (error) {
      setErrorMessage('Invalid email or password. Please try again.');
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
        <h1>Sign In</h1>
        <p className="signin-subtitle">
          Welcome back to KHEMET Smart Guide
        </p>

        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="signin-field">
            <label htmlFor="email">EMAIL ADDRESS</label>
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
            <label htmlFor="password">PASSWORD</label>

            <div className="password-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
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
              Forgot password?
            </Link>
          </div>

          {errorMessage && (
            <p className="signin-error">{errorMessage}</p>
          )}

          <button className="signin-submit" type="submit" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="signin-divider">
            <span />
            <p>OR</p>
            <span />
          </div>

          <button
            type="button"
            className="signin-guest"
            onClick={handleGuest}
          >
            Continue as Guest
          </button>

          <p className="signin-register">
            Don&apos;t have an account?{' '}
            <Link to={ROUTES.SIGN_UP}>Register</Link>
          </p>
        </form>
      </section>

      <footer className="auth-footer">
        <p>Secure authentication provided by Grand Egyptian Museum</p>
        <div>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </footer>
    </main>
  );
}