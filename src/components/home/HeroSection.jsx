import { useTranslation } from 'react-i18next';
import FadeGallery from './FadeGallery';

export default function HeroSection() {
  const { t } = useTranslation();

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
          <button className="home-primary-btn" type="button">
            {t('home.hero.explore')}
          </button>

          
        </div>
      </div>
    </section>
  );
}