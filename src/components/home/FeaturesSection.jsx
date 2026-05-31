import { useTranslation } from 'react-i18next';
import { features } from '../../data/homeData';
import { ROUTES } from '../../constants/routes';
import FeatureCard from './FeatureCard';

const featureKeys = [
  {
    titleKey: 'home.features.card1.title',
    descriptionKey: 'home.features.card1.description',
    path: ROUTES.COLLECTIONS,
  },
  {
    titleKey: 'home.features.card2.title',
    descriptionKey: 'home.features.card2.description',
    path: ROUTES.SCAN_AI,
  },
  {
    titleKey: 'home.features.card3.title',
    descriptionKey: 'home.features.card3.description',
    path: ROUTES.CHAT_AI,
  },
];

export default function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <section className="home-features">
      <div className="home-section-title">
        <h2>
          {t('home.features.title1')}
          <br />
          <span>{t('home.features.title2')}</span>
        </h2>

        <div className="home-title-line" />

        <p>{t('home.features.description')}</p>
      </div>

      <div className="home-features-grid">
        {features.map((feature, index) => (
          <FeatureCard
            key={featureKeys[index].titleKey}
            icon={feature.icon}
            titleKey={featureKeys[index].titleKey}
            descriptionKey={featureKeys[index].descriptionKey}
            path={featureKeys[index].path}
          />
        ))}
      </div>
    </section>
  );
}
