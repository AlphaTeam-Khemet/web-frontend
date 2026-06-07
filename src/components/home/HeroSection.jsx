import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import FadeGallery from './FadeGallery';
import { ROUTES } from '../../constants/routes';

export default function HeroSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="home-hero">
      <FadeGallery />

      <div className="home-hero-content">
        <h1>
          {t('home.hero.title1')}
          <br />
          {t('home.hero.title2')}
          <br />
          <span>{t('home.hero.title3')}</span>
        </h1>

        <p>{t('home.hero.description')}</p>

        <div className="home-hero-actions">
          <button
            className="home-primary-btn"
            type="button"
            onClick={() => navigate(ROUTES.TOUR)}
          >
            {t('home.hero.startTour')}-&gt;
          </button>

          
        </div>
      </div>
    </section>
  );
}
