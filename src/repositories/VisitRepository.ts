import type { CommunityVisit } from '../models/visit';
import type { IStorage } from '../storage/IStorage';
import { BaseRepository } from './BaseRepository';
import { success, type Result } from '../errors/AppError';

export class VisitRepository extends BaseRepository<CommunityVisit> {
  constructor(storage: IStorage) {
    super(storage, 'visits');
  }

  async getUnsynced(): Promise<Result<CommunityVisit[]>> {
    const result = await this.getAll();
    if (!result.success) return result;
    return success(result.data.filter((v) => !v.synced));
  }

  async add(visit: CommunityVisit): Promise<Result<CommunityVisit>> {
    return this.addItem(visit);
  }

  async markAllSynced(): Promise<Result<void>> {
    const result = await this.getAll();
    if (!result.success) return result;
    const synced = result.data.map((v) => ({ ...v, synced: true }));
    return this.save(synced);
  }

  async getHighRisk(): Promise<Result<CommunityVisit[]>> {
    const result = await this.getAll();
    if (!result.success) return result;
    return success(
      result.data.filter((v) => {
        const bp = parseInt(v.bloodPressure?.split('/')[0] || '0', 10);
        const temp = parseFloat(v.temperature || '0');
        return bp > 140 || temp > 38;
      })
    );
  }
}
