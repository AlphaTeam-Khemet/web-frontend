import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import CollectionCard from '../components/collections/CollectionCard';
import Footer from '../components/home/Footer';
import { useFavorites } from '../context/FavoritesContext';
import { getApiErrorMessage } from '../utils/apiData';

import '../styles/collections.css';
import '../styles/favorites.css';

const filters = [
  { value: 'All', labelKey: 'collections.filters.all' },
  { value: 'Statues', labelKey: 'collections.filters.statues' },
  { value: 'Sarcophagi', labelKey: 'collections.filters.sarcophagi' },
  { value: 'Papyrus', labelKey: 'collections.filters.papyrus' },
];

export default function Favorites() {
  const { t } = useTranslation();
  const { favorites, isFavorite, toggleFavorite, refreshFavorites } =
    useFavorites();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    refreshFavorites().catch((error) => {
      setErrorMessage(
        getApiErrorMessage(error, t('favorites.loadError'))
      );
    });
  }, []);

  const filteredFavorites = useMemo(() => {
    const searchValue = searchTerm.trim().toLowerCase();

    return favorites.filter((item) => {
      const category = item.category || '';
      const matchesFilter =
        activeFilter === 'All' || category === activeFilter;

      const searchableText = `
        ${item.displayName || t(item.titleKey || item.name || '')}
        ${item.period || t(item.periodKey || '')}
        ${item.location || t(item.locationKey || '')}
        ${category}
      `.toLowerCase();

      const matchesSearch =
        searchValue === '' || searchableText.includes(searchValue);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, favorites, searchTerm, t]);

  return (
    <main className="collections-page favorites-page">
      <section className="collections-container favorites-container">
        <div className="collections-heading">
          <h1>{t('favorites.title')}</h1>
          <p>{t('favorites.subtitle')}</p>
        </div>

        <div className="collections-search favorites-search">
          <Search size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t('favorites.searchPlaceholder')}
          />
        </div>

        <div className="collections-filters">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              className={filter.value === activeFilter ? 'active' : ''}
              onClick={() => setActiveFilter(filter.value)}
            >
              {t(filter.labelKey)}
            </button>
          ))}
        </div>

        {errorMessage && (
          <div className="collections-empty">{errorMessage}</div>
        )}

        <div className="collections-grid favorites-grid">
          {filteredFavorites.map((item, index) => (
            <CollectionCard
              key={item.id}
              item={item}
              index={index}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>

        {filteredFavorites.length === 0 && !errorMessage && (
          <div className="collections-empty">
            {favorites.length === 0
              ? t('favorites.empty')
              : t('favorites.noResults')}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
