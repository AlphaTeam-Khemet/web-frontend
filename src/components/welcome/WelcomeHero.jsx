import { Link, useNavigate } from 'react-router-dom';
import khemetLogo from '../../assets/logo/khemet-logo.png';
import welcomeBg from '../../assets/images/welcome-bg.png';
import WelcomeActions from './WelcomeActions';
import useAuth from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';

export default function WelcomeHero() {
  const navigate = useNavigate();
  const { continueAsGuest } = useAuth();
  const { t } = useTranslation();

  const handleGuest = () => {
    continueAsGuest();
    navigate('/home');
  };

  return (
    <main className="welcome-page">
      <img src={welcomeBg} alt="" className="welcome-bg" />

      <div className="welcome-overlay" />

      <section className="welcome-content">
        <p className="welcome-kicker">{t('welcome.kicker')}</p>

        <div className="welcome-logo-wrap">
          <img src={khemetLogo} alt="KHEMET" className="welcome-logo" />
        </div>

        <div className="welcome-divider">
          <span />
          <i />
          <span />
        </div>

        <WelcomeActions
          onSignIn={() => navigate('/sign-in')}
          onGuest={handleGuest}
        />

        <p className="welcome-register">
          {t('auth.noAccount')} <Link to="/sign-up">{t('auth.register')}</Link>
        </p>
      </section>

      <p className="welcome-footer">{t('welcome.footer')}</p>
    </main>
  );
}
