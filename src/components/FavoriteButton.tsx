import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../context/FavoritesContext';
import type { FavoriteType } from '../models/favorite';
import { colors } from '../theme/colors';

interface FavoriteButtonProps {
  type: FavoriteType;
  itemId: string;
  size?: number;
}

export function FavoriteButton({ type, itemId, size = 22 }: FavoriteButtonProps) {
  const { toggle } = useFavorites();
  const [active, setActive] = useState(false);

  useEffect(() => {
    (async () => {
      const { FavoritesService } = await import('../services/favoritesService');
      const fav = await FavoritesService.isFavorite(type, itemId);
      setActive(fav);
    })();
  }, [itemId]);

  const handlePress = async () => {
    const result = await toggle(type, itemId);
    setActive(result);
  };

  return (
    <Pressable onPress={handlePress} hitSlop={8}>
      <Ionicons
        name={active ? 'heart' : 'heart-outline'}
        size={size}
        color={active ? colors.danger : colors.textSecondary}
      />
    </Pressable>
  );
}
