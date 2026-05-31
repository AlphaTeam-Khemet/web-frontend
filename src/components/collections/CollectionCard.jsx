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
  const title = item.displayName || t(item.titleKey || item.name || '');
  const period = item.period || t(item.periodKey || '');
  const location = item.location || t(item.locationKey || '');

  return (
    <article
      className="collection-card"
      style={{ '--card-delay': `${index * 90}ms` }}
    >
      <Link
        to={getArtifactDetailsRoute(item.id)}
        className="collection-card-image"
      >
        <img src={item.image} alt={title} />
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
        <h3>{title}</h3>
        <p>{period}</p>
        <span>{location}</span>
      </div>
    </article>
  );
}
