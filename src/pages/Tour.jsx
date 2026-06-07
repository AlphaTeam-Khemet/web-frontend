import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Maximize2 } from 'lucide-react';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

import logo from '../assets/images/home/khemet-logo.png';
import tourVideo from '../assets/videos/splash-bg.mp4';

import '../styles/tour.css';

export default function Tour() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <main className="tour-page">
      <header className="tour-header">
        <button
          type="button"
          className="tour-back"
          onClick={() => navigate('/home')}
          aria-label={t('tour.back')}
        >
          <ArrowLeft size={20} />
        </button>

        <img src={logo} alt="Khemet" className="tour-logo" />
      </header>

      <section className="tour-stage">
        <div className="tour-frame">
          <video
            className="tour-video"
            src={tourVideo}
            controls
            playsInline
          />

          <div className="tour-quality">
            4K UHD
          </div>

          <Maximize2 className="tour-expand" size={19} />
        </div>

        <h1>
          {t('tour.title1')}
          <br />
          {t('tour.title2')}
        </h1>
      </section>

      <footer className="tour-footer">
        <img src={logo} alt="Khemet" />

        <div className="tour-footer-center">
          <div>
            <a href="https://example.com/privacy">{t('home.footer.privacy')}</a>
            <span>|</span>
            <a href="https://example.com/accessibility">{t('home.footer.accessibility')}</a>
          </div>

          <p>{t('home.footer.copyright')}</p>
        </div>

        <div className="tour-social">
          <a href="https://example.com/facebook" aria-label="Facebook">
            <FaFacebook size={16} />
          </a>

          <a href="https://example.com/instagram" aria-label="Instagram">
            <FaInstagram size={16} />
          </a>

          <a href="https://example.com/youtube" aria-label="YouTube">
            <FaYoutube size={19} />
          </a>
        </div>
      </footer>
    </main>
  );
}
