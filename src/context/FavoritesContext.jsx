import { createContext, useContext, useEffect, useMemo, useState } from 'react';

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

  const toggleFavorite = (artifact) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === artifact.id);

      if (exists) {
        return prev.filter((item) => item.id !== artifact.id);
      }

      return [...prev, artifact];
    });

    /*
      Backend later:
      if exists => DELETE /favorites/:artifactId
      else => POST /favorites
    */
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