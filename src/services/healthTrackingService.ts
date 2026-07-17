import type { HealthIndicator } from '../models/healthIndicator';
import { StorageService } from './storage';

const KEY = 'health_indicators';

export const HealthTrackingService = {
  async getAll(): Promise<HealthIndicator[]> {
    return (await StorageService.get<HealthIndicator[]>(KEY)) ?? [];
  },

  async add(indicator: Omit<HealthIndicator, 'id' | 'timestamp'>): Promise<HealthIndicator> {
    const all = await this.getAll();
    const newIndicator: HealthIndicator = {
      ...indicator,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    all.unshift(newIndicator);
    await StorageService.set(KEY, all);
    return newIndicator;
  },

  async getLatest(): Promise<HealthIndicator | null> {
    const all = await this.getAll();
    return all.length > 0 ? all[0] : null;
  },

  async getByDateRange(start: number, end: number): Promise<HealthIndicator[]> {
    const all = await this.getAll();
    return all.filter((h) => h.timestamp >= start && h.timestamp <= end);
  },

  async getRecent(days: number = 30): Promise<HealthIndicator[]> {
    const cutoff = Date.now() - days * 86400000;
    const all = await this.getAll();
    return all.filter((h) => h.timestamp >= cutoff);
  },
};
