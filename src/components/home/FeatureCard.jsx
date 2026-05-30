import { useTranslation } from 'react-i18next';

export default function FeatureCard({
  icon: Icon,
  titleKey,
  descriptionKey,
}) {
  const { t } = useTranslation();

  return (
    <article className="home-feature-card">
      <div className="home-feature-icon">
        <Icon size={28} />
      </div>

      <h3>{t(titleKey)}</h3>

      <p>{t(descriptionKey)}</p>

      <a href="#">{t('home.features.learnMore')} →</a>
    </article>
  );
}