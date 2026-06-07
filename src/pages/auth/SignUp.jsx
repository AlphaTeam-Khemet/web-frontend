import { LockKeyhole } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import RegisterForm from '../../components/auth/RegisterForm';
import registerBg from '../../assets/images/register-bg.png';
import '../../styles/register.css';

export default function SignUp() {
  const { t } = useTranslation();

  return (
    <main className="register-page">
      <img src={registerBg} alt="" className="register-bg" />
      <div className="register-overlay" />
      <div className="register-pattern" />

      

      
      <RegisterForm />

      <footer className="register-footer">
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
