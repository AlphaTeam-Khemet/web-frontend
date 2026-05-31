import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import TermsCheckbox from './TermsCheckbox';
import PasswordStrength from './PasswordStrength';
import { ROUTES } from '../../constants/routes';
import { authApi } from '../../api/authApi';
import { getApiErrorMessage } from '../../utils/apiData';
import useAuth from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';

const backendLanguageIds = {
  en: 1,
  ar: 2,
  es: 1,
  fr: 1,
  de: 4,
  zh: 1,
};

export default function RegisterForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const validatePassword = (password) => {
    const hasCapital = /[A-Z]/.test(password);
    const hasSmall = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasUnderscore = /_/.test(password);
    const hasLength = password.length >= 8;

    return hasCapital && hasSmall && hasNumber && hasUnderscore && hasLength;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (!validatePassword(formData.password)) {
      setErrorMessage(
        'Password must contain capital letter, small letter, number, underscore, and at least 8 characters.'
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!acceptedTerms) {
      setErrorMessage('You must accept the Terms and Privacy Policy.');
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await authApi.register({
        full_name: formData.fullName.trim(),
        email: formData.email,
        password: formData.password,
        preferred_language: backendLanguageIds[language] || backendLanguageIds.en,
      });
      login(data);
      navigate(ROUTES.HOME);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'This email may already be registered. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="register-card">
      <h1>Create Account</h1>

      <p className="register-subtitle">
        Start your smart journey through ancient Egypt.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="register-field">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(event) => updateField('fullName', event.target.value)}
          />
        </div>

        <div className="register-field">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={(event) => updateField('email', event.target.value)}
          />
        </div>

        <div className="register-field">
          <label>Password</label>
          <div className="register-password">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(event) => updateField('password', event.target.value)}
            />

            <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <PasswordStrength password={formData.password} />

        <div className="register-field">
          <label>Confirm Password</label>
          <div className="register-password">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(event) =>
                updateField('confirmPassword', event.target.value)
              }
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <TermsCheckbox checked={acceptedTerms} onChange={setAcceptedTerms} />

        <div className="register-captcha">
          <ShieldCheck size={16} />
          Protected by Invisible CAPTCHA
        </div>

        {errorMessage && <p className="register-error">{errorMessage}</p>}

        <button className="register-submit" type="submit" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
          <ArrowRight size={18} />
        </button>
      </form>

      <p className="register-login">
        Already have an account? <Link to={ROUTES.SIGN_IN}>Sign In</Link>
      </p>
    </section>
  );
}
