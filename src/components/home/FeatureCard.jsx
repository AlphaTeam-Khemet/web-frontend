import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function FeatureCard({
  icon: Icon,
  titleKey,
  descriptionKey,
  path,
}) {
  const { t } = useTranslation();

  return (
    <article className="home-feature-card">
      <div className="home-feature-icon">
        <Icon size={28} />
      </div>

      <h3>{t(titleKey)}</h3>

      <p>{t(descriptionKey)}</p>

      <Link to={path}>{t('home.features.learnMore')} →</Link>
    </article>
  );
}
