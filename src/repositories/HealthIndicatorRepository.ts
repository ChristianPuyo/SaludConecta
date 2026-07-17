import type { HealthIndicator } from '../models/healthIndicator';
import type { IStorage } from '../storage/IStorage';
import { BaseRepository } from './BaseRepository';
import { success, type Result } from '../errors/AppError';

export class HealthIndicatorRepository extends BaseRepository<HealthIndicator> {
  constructor(storage: IStorage) {
    super(storage, 'health_indicators');
  }

  async add(indicator: HealthIndicator): Promise<Result<HealthIndicator>> {
    return this.addItem(indicator);
  }

  async getLatest(): Promise<Result<HealthIndicator | null>> {
    const result = await this.getAll();
    if (!result.success) return result;
    return success(result.data.length > 0 ? result.data[0] : null);
  }

  async getRecent(days: number = 30): Promise<Result<HealthIndicator[]>> {
    const result = await this.getAll();
    if (!result.success) return result;
    const cutoff = Date.now() - days * 86400000;
    return success(result.data.filter((h) => h.timestamp >= cutoff));
  }
}
