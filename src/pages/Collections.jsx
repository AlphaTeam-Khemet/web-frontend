import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import CollectionCard from '../components/collections/CollectionCard';
import Footer from '../components/home/Footer';
import { collectionsMockData } from '../data/collectionsMockData';

import '../styles/collections.css';

const filters = [
  { value: 'All', labelKey: 'collections.filters.all' },
  { value: 'Statues', labelKey: 'collections.filters.statues' },
  { value: 'Sarcophagi', labelKey: 'collections.filters.sarcophagi' },
  { value: 'Papyrus', labelKey: 'collections.filters.papyrus' },
];

const INITIAL_VISIBLE_COUNT = 4;
const LOAD_MORE_COUNT = 4;

export default function Collections() {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [favoriteIds, setFavoriteIds] = useState([]);

  const filteredCollections = useMemo(() => {
    const searchValue = searchTerm.trim().toLowerCase();

    return collectionsMockData.filter((item) => {
      const matchesFilter =
        activeFilter === 'All' || item.category === activeFilter;

      const searchableText = `
        ${item.title}
        ${item.period}
        ${item.location}
        ${item.category}
      `.toLowerCase();

      const matchesSearch =
        searchValue === '' || searchableText.includes(searchValue);

      return matchesFilter && matchesSearch;
    });
  }, [searchTerm, activeFilter]);

  const visibleCollections = filteredCollections.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCollections.length;

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + LOAD_MORE_COUNT);

    setTimeout(() => {
      window.scrollBy({
        top: 320,
        behavior: 'smooth',
      });
    }, 120);
  };

  const handleToggleFavorite = (item) => {
    setFavoriteIds((prev) => {
      const isAlreadyFavorite = prev.includes(item.id);

      if (isAlreadyFavorite) {
        return prev.filter((id) => id !== item.id);
      }

      return [...prev, item.id];
    });
  };

  return (
    <main className="collections-page">
      <section className="collections-container">
        <div className="collections-heading">
          <h1>{t('collections.title')}</h1>
          <p>{t('collections.description')}</p>
        </div>

        <div className="collections-search">
          <Search size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={t('collections.searchPlaceholder')}
          />
        </div>

        <div className="collections-filters">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              className={filter.value === activeFilter ? 'active' : ''}
              onClick={() => handleFilterChange(filter.value)}
            >
              {t(filter.labelKey)}
            </button>
          ))}
        </div>

        <div className="collections-grid">
          {visibleCollections.map((item, index) => (
            <CollectionCard
              key={item.id}
              item={item}
              index={index}
              isFavorite={favoriteIds.includes(item.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>

        {visibleCollections.length === 0 && (
          <div className="collections-empty">{t('collections.empty')}</div>
        )}

        {hasMore && (
          <div className="collections-more">
            <button type="button" onClick={handleShowMore}>
              <span>{t('collections.more')}</span>
            </button>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}