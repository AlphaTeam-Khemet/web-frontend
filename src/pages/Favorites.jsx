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
      const searchableText = `
        ${item.displayName || t(item.titleKey || item.name || '')}
        ${item.period || t(item.periodKey || '')}
        ${item.location || t(item.locationKey || '')}
        ${item.category || ''}
        ${item.description || t(item.descriptionKey) || ''}
      `.toLowerCase();

      let matchesFilter = false;
      if (activeFilter === 'All') {
        matchesFilter = true;
      } else if (activeFilter === 'Statues') {
        matchesFilter = item.category === 'Statue' || searchableText.includes('statue');
      } else if (activeFilter === 'Sarcophagi') {
        matchesFilter = searchableText.includes('sarcophag') || searchableText.includes('coffin');
      } else if (activeFilter === 'Papyrus') {
        matchesFilter = searchableText.includes('papyrus');
      } else {
        matchesFilter = item.category === activeFilter;
      }

      const matchesSearch =
        searchValue === '' || searchableText.includes(searchValue);

      return matchesFilter && matchesSearch;
    }).sort((a, b) => {
      const pa = parseInt(a.priority, 10) || 157;
      const pb = parseInt(b.priority, 10) || 157;
      
      if (pa !== pb) {
        return pa - pb;
      }
      
      const nameA = a.displayName || '';
      const nameB = b.displayName || '';
      return nameA.localeCompare(nameB);
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

        <div className="collections-filters-wrapper">
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
        </div>

        {errorMessage && (
          <div className="collections-empty">{errorMessage}</div>
        )}

        <div className="collections-masonry favorites-masonry">
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
