export type FavoriteType = 'article' | 'health_center' | 'campaign';

export interface Favorite {
  id: string;
  type: FavoriteType;
  itemId: string;
  createdAt: string;
}

export type Settings = {
  language: string;
  offlineMode: boolean;
  autoSync: boolean;
  notificationsEnabled: boolean;
};
