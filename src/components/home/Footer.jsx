import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import logo from '../../assets/images/home/khemet-logo.png';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="home-footer">
      <div className="home-footer-logo">
        <img src={logo} alt="Khemet Logo" />
      </div>

      <div className="home-footer-center">
        <div>
          <a href="https://example.com/privacy">{t('home.footer.privacy')}</a>
          <span>|</span>
          <a href="https://example.com/accessibility">{t('home.footer.accessibility')}</a>
        </div>

        <p>{t('home.footer.copyright')}</p>
      </div>

      <div className="home-social">
        <a href="https://example.com/instagram" aria-label="Instagram">
          <FaInstagram size={20} />
        </a>

        <a href="https://example.com/facebook" aria-label="Facebook">
          <FaFacebook size={20} />
        </a>

        <a href="https://example.com/youtube" aria-label="YouTube">
          <FaYoutube size={22} />
        </a>
      </div>
    </footer>
  );
}
