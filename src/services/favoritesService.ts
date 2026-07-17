import type { Favorite, FavoriteType } from '../models/favorite';
import { StorageService } from './storage';

const KEY = 'favorites';

export const FavoritesService = {
  async getAll(): Promise<Favorite[]> {
    return (await StorageService.get<Favorite[]>(KEY)) ?? [];
  },

  async toggle(type: FavoriteType, itemId: string): Promise<boolean> {
    const all = await this.getAll();
    const existing = all.find((f) => f.type === type && f.itemId === itemId);
    if (existing) {
      await StorageService.set(KEY, all.filter((f) => f.id !== existing.id));
      return false; // removed
    }
    const fav: Favorite = {
      id: Date.now().toString(),
      type,
      itemId,
      createdAt: new Date().toISOString(),
    };
    all.unshift(fav);
    await StorageService.set(KEY, all);
    return true; // added
  },

  async isFavorite(type: FavoriteType, itemId: string): Promise<boolean> {
    const all = await this.getAll();
    return all.some((f) => f.type === type && f.itemId === itemId);
  },

  async getByType(type: FavoriteType): Promise<Favorite[]> {
    const all = await this.getAll();
    return all.filter((f) => f.type === type);
  },

  async remove(id: string): Promise<void> {
    const all = await this.getAll();
    await StorageService.set(KEY, all.filter((f) => f.id !== id));
  },
};
