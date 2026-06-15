import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import CollectionCard from '../components/collections/CollectionCard';
import Footer from '../components/home/Footer';
import { useFavorites } from '../context/FavoritesContext';
import { useLanguage } from '../context/LanguageContext';
import { artifactsApi } from '../api/artifactsApi';
import { getApiErrorMessage, normalizeMonument } from '../utils/apiData';

import '../styles/collections.css';

const filters = [
  { value: 'All', labelKey: 'collections.filters.all' },
  { value: 'Statues', labelKey: 'collections.filters.statues' },
  { value: 'Sarcophagi', labelKey: 'collections.filters.sarcophagi' },
  { value: 'Papyrus', labelKey: 'collections.filters.papyrus' },
];

const INITIAL_VISIBLE_COUNT = 16;
const LOAD_MORE_COUNT = 16;

export default function Collections() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;

    async function loadMonuments() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const { data } = await artifactsApi.getAll({ lang: language });
        if (active) setCollections(data.map(normalizeMonument));
      } catch (error) {
        if (active) {
          setErrorMessage(getApiErrorMessage(error, 'Unable to load monuments from the backend.'));
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadMonuments();

    return () => {
      active = false;
    };
  }, [language]);

  const filteredCollections = useMemo(() => {
    const searchValue = searchTerm.trim().toLowerCase();

    return collections.filter((item) => {
      const searchableText = `
        ${item.displayName || t(item.titleKey)}
        ${item.period || t(item.periodKey)}
        ${item.location || t(item.locationKey)}
        ${item.category}
        ${item.description || t(item.descriptionKey) || ''}
      `.toLowerCase();

      // Smart filtering logic since Sarcophagi/Papyrus are often tagged generically as "Artifact"
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
        return pa - pb; // lower number = higher priority = comes first
      }
      
      // Secondary sort alphabetically
      const nameA = a.displayName || '';
      const nameB = b.displayName || '';
      return nameA.localeCompare(nameB);
    });
  }, [searchTerm, activeFilter, t, collections]);

  const heroes = filteredCollections.filter((item) => (parseInt(item.priority, 10) || 157) <= 30);
  const regularItems = filteredCollections.filter((item) => (parseInt(item.priority, 10) || 157) > 30);

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
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('collections.searchPlaceholder')}
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

        {heroes.length > 0 && (
          <div className="collections-heroes-grid">
            {heroes.map((item, index) => (
              <CollectionCard
                key={item.id}
                item={item}
                index={index}
                isFavorite={isFavorite(item.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}

        {regularItems.length > 0 && (
          <div className="collections-masonry">
            {regularItems.map((item, index) => (
              <CollectionCard
                key={item.id}
                item={item}
                index={index}
                isFavorite={isFavorite(item.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}

        {isLoading && (
          <div className="collections-empty">Loading majestic artifacts...</div>
        )}

        {errorMessage && (
          <div className="collections-empty">{errorMessage}</div>
        )}

        {!isLoading && filteredCollections.length === 0 && (
          <div className="collections-empty">{t('collections.empty')}</div>
        )}
      </section>

      <Footer />
    </main>
  );
}
