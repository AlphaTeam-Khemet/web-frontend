import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { artifactsApi } from '../api/artifactsApi';
import { normalizeMonument } from '../utils/apiData';
import { storage } from '../utils/storage';

const FavoritesContext = createContext(null);

const STORAGE_KEY = 'khemet-favorites';

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return [];

    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const refreshFavorites = async () => {
    if (!storage.getToken()) return;

    const { data } = await artifactsApi.getFavorites();
    setFavorites(data.map((item) => ({
      ...normalizeMonument(item.Monument || item.monument || {}),
      favoriteId: item.id,
    })));
  };

  const toggleFavorite = async (artifact) => {
    if (!storage.getToken()) {
      throw new Error('Please sign in to add artifacts to favorites.');
    }

    const existing = favorites.find((item) => item.id === artifact.id);

    setFavorites((prev) => {
      if (existing) {
        return prev.filter((item) => item.id !== artifact.id);
      }

      return [...prev, artifact];
    });

    try {
      if (existing) {
        if (existing.favoriteId) {
          await artifactsApi.removeFavorite(existing.favoriteId);
        } else {
          await refreshFavorites();
        }
        return;
      }

      const { data } = await artifactsApi.addFavorite(artifact.id);
      setFavorites((prev) =>
        prev.map((item) =>
          item.id === artifact.id ? { ...item, favoriteId: data.id } : item
        )
      );
    } catch {
      await refreshFavorites();
    }
  };

  const isFavorite = (artifactId) => {
    return favorites.some((item) => item.id === artifactId);
  };

  const value = useMemo(
    () => ({
      favorites,
      favoritesCount: favorites.length,
      toggleFavorite,
      isFavorite,
      refreshFavorites,
    }),
    [favorites]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error('useFavorites must be used inside FavoritesProvider');
  }

  return context;
}
