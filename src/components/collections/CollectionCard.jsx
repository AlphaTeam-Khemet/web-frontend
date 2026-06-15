import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getArtifactDetailsRoute } from '../../constants/routes';
import useAuth from '../../hooks/useAuth';

export default function CollectionCard({
  item,
  isFavorite,
  onToggleFavorite,
  index,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const title = item.displayName || t(item.titleKey || item.name || '');
  const period = item.period || t(item.periodKey || '');
  const location = item.location || t(item.locationKey || '');

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert(t('favorites.signInRequired'));
      navigate('/sign-in');
      return;
    }

    try {
      await onToggleFavorite(item);
    } catch (error) {
      alert(error.message || t('favorites.signInRequired'));
    }
  };

  const rank = parseInt(item.priority, 10) || 157;
  
  let priorityStage = 5;
  if (rank <= 4) priorityStage = 1;
  else if (rank <= 12) priorityStage = 2;
  else if (rank <= 30) priorityStage = 3;
  else if (rank <= 100) priorityStage = 4;

  return (
    <article
      className={`collection-card stage-${priorityStage}`}
      style={{ '--card-delay': `${(index % 16) * 60}ms` }}
    >
      <Link
        to={getArtifactDetailsRoute(item.id)}
        className="collection-card-inner"
      >
        {priorityStage <= 3 && (
          <div className="priority-badge">
            <span className="star-icon">
              {priorityStage === 1 ? '👑' : priorityStage === 2 ? '⭐' : '✨'}
            </span>
            {priorityStage === 1 ? t('collections.legend', 'Legend') : priorityStage === 2 ? t('collections.icon', 'Icon') : t('collections.featured', 'Featured')}
          </div>
        )}
        <img src={item.image} alt={title} loading="lazy" />
        
        <div className="collection-card-overlay">
          <div className="collection-card-content">
            <h3>{title}</h3>
            <p>{period}</p>
            {location && <span>{location}</span>}
          </div>
        </div>
      </Link>

      <button
        type="button"
        className={isFavorite ? 'favorite-btn active' : 'favorite-btn'}
        onClick={handleToggleFavorite}
        aria-label="Add to favorites"
      >
        <Heart size={18} />
      </button>
    </article>
  );
}
