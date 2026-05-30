import { useEffect, useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import CollectionCard from '../components/collections/CollectionCard';
import { useFavorites } from '../context/FavoritesContext';
import { getApiErrorMessage } from '../utils/apiData';

export default function Favorites() {
  const { favorites, isFavorite, toggleFavorite, refreshFavorites } = useFavorites();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    refreshFavorites().catch((error) => {
      setErrorMessage(getApiErrorMessage(error, 'Unable to load favorites.'));
    });
  }, []);

  return (
    <PageLayout>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="font-display text-5xl font-bold text-khemet-dark">Favorites</h1>
        <p className="mt-4 text-khemet-gray">Saved artifacts from your account appear here.</p>

        {errorMessage && <p className="mt-6 text-red-600">{errorMessage}</p>}

        <div className="collections-grid mt-10">
          {favorites.map((item, index) => (
            <CollectionCard
              key={item.id}
              item={item}
              index={index}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>

        {favorites.length === 0 && !errorMessage && (
          <p className="mt-8 text-khemet-gray">No favorites saved yet.</p>
        )}
      </section>
    </PageLayout>
  );
}
