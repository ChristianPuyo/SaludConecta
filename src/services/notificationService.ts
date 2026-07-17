import type { AppNotification, NotificationType } from '../models/notification';
import { StorageService } from './storage';

const KEY = 'notifications';

export const NotificationService = {
  async getAll(): Promise<AppNotification[]> {
    return (await StorageService.get<AppNotification[]>(KEY)) ?? [];
  },

  async add(notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): Promise<AppNotification> {
    const all = await this.getAll();
    const newNotif: AppNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: Date.now(),
      read: false,
    };
    all.unshift(newNotif);
    await StorageService.set(KEY, all);
    return newNotif;
  },

  async markAsRead(id: string): Promise<void> {
    const all = await this.getAll();
    const idx = all.findIndex((n) => n.id === id);
    if (idx !== -1) {
      all[idx].read = true;
      await StorageService.set(KEY, all);
    }
  },

  async markAllAsRead(): Promise<void> {
    const all = await this.getAll();
    all.forEach((n) => { n.read = true; });
    await StorageService.set(KEY, all);
  },

  async getUnread(): Promise<AppNotification[]> {
    const all = await this.getAll();
    return all.filter((n) => !n.read);
  },

  async getByType(type: NotificationType): Promise<AppNotification[]> {
    const all = await this.getAll();
    return all.filter((n) => n.type === type);
  },

  async remove(id: string): Promise<void> {
    const all = await this.getAll();
    await StorageService.set(KEY, all.filter((n) => n.id !== id));
  },

  async generateRiskAlert(district: string, risk: string): Promise<void> {
    await this.add({
      title: 'Alerta en tu distrito',
      body: `El nivel de riesgo en ${district} ha aumentado a ${risk}. Toma precauciones.`,
      type: 'riesgo_distrito',
      date: new Date().toISOString(),
      data: { district, risk },
    });
  },
};
