import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getArtifactDetailsRoute } from '../../constants/routes';

export default function CollectionCard({
  item,
  isFavorite,
  onToggleFavorite,
  index,
}) {
  const { t } = useTranslation();

  return (
    <article
      className="collection-card"
      style={{ '--card-delay': `${index * 90}ms` }}
    >
      <Link
        to={getArtifactDetailsRoute(item.id)}
        className="collection-card-image"
      >
        <img src={item.image} alt={t(item.titleKey)} />
      </Link>

      <button
        type="button"
        className={isFavorite ? 'favorite-btn active' : 'favorite-btn'}
        onClick={() => onToggleFavorite(item)}
        aria-label="Add to favorites"
      >
        <Heart size={18} />
      </button>

      <div className="collection-card-content">
        <h3>{t(item.titleKey)}</h3>
        <p>{t(item.periodKey)}</p>
        <span>{t(item.locationKey)}</span>
      </div>
    </article>
  );
}