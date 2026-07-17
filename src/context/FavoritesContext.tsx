import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Favorite, FavoriteType } from '../models/favorite';
import { FavoritesService } from '../services/favoritesService';

interface FavoritesContextValue {
  favorites: Favorite[];
  isLoading: boolean;
  toggle: (type: FavoriteType, itemId: string) => Promise<boolean>;
  isFavorite: (type: FavoriteType, itemId: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    const data = await FavoritesService.getAll();
    setFavorites(data);
    setIsLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggle = async (type: FavoriteType, itemId: string) => {
    const result = await FavoritesService.toggle(type, itemId);
    await load();
    return result;
  };

  const isFavorite = async (type: FavoriteType, itemId: string) => {
    return FavoritesService.isFavorite(type, itemId);
  };

  const value = useMemo(
    () => ({ favorites, isLoading, toggle, isFavorite, refresh: load }),
    [favorites, isLoading]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within a FavoritesProvider');
  return context;
}
