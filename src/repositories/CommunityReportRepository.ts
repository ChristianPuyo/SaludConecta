import type { CommunityReport } from '../models/communityReport';
import type { CommunityReportStatus } from '../types/health';
import type { IStorage } from '../storage/IStorage';
import { BaseRepository } from './BaseRepository';
import { success, type Result } from '../errors/AppError';

export class CommunityReportRepository extends BaseRepository<CommunityReport> {
  constructor(storage: IStorage) {
    super(storage, 'community_reports');
  }

  async add(report: CommunityReport): Promise<Result<CommunityReport>> {
    return this.addItem(report);
  }

  async updateStatus(id: string, status: CommunityReportStatus): Promise<Result<CommunityReport>> {
    return this.updateItem(id, (item) => ({ ...item, status }));
  }

  async getByDistrict(district: string): Promise<Result<CommunityReport[]>> {
    const result = await this.getAll();
    if (!result.success) return result;
    return success(result.data.filter((r) => r.district === district));
  }
}
