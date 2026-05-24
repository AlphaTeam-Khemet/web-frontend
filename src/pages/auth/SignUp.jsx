import { Link } from 'react-router-dom';
import { ArrowLeft, LockKeyhole, Timer } from 'lucide-react';
import RegisterForm from '../../components/auth/RegisterForm';
import registerBg from '../../assets/images/register-bg.png';
import { ROUTES } from '../../constants/routes';
import '../../styles/register.css';

export default function SignUp() {
  return (
    <main className="register-page">
      <img src={registerBg} alt="" className="register-bg" />
      <div className="register-overlay" />
      <div className="register-pattern" />

      <Link to={ROUTES.SIGN_IN} className="register-top-link">
        <span>
          <ArrowLeft size={18} />
        </span>
        Sign In
      </Link>

      
      <RegisterForm />

      <footer className="register-footer">
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