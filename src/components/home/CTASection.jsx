import { useTranslation } from 'react-i18next';
import ctaBg from '../../assets/images/home/cta-bg.png';

export default function CTASection() {
  const { t } = useTranslation();

  return (
    <section
      className="home-cta"
      style={{ backgroundImage: `url(${ctaBg})` }}
    >
      <div className="home-cta-overlay" />

      <div className="home-cta-content">
        <h2>
          {t('home.cta.title1')} <span>{t('home.cta.title2')}</span>
        </h2>

        <p>{t('home.cta.description')}</p>

      </div>
    </section>
  );
}