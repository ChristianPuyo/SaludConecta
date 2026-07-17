import type { SymptomReport } from '../models/report';
import type { IStorage } from '../storage/IStorage';
import { BaseRepository } from './BaseRepository';
import { success, type Result } from '../errors/AppError';

export class ReportRepository extends BaseRepository<SymptomReport> {
  constructor(storage: IStorage) {
    super(storage, 'reports');
  }

  async getByDistrict(district: string): Promise<Result<SymptomReport[]>> {
    const result = await this.getAll();
    if (!result.success) return result;
    return success(result.data.filter((r) => r.district === district));
  }

  async getRecent(days: number = 7): Promise<Result<SymptomReport[]>> {
    const result = await this.getAll();
    if (!result.success) return result;
    const cutoff = Date.now() - days * 86400000;
    return success(result.data.filter((r) => r.timestamp >= cutoff));
  }

  async add(report: SymptomReport): Promise<Result<SymptomReport>> {
    return this.addItem(report);
  }

  async updateStatus(id: string, status: SymptomReport['status']): Promise<Result<SymptomReport>> {
    return this.updateItem(id, (item) => ({ ...item, status }));
  }
}

export type IReportRepository = InstanceType<typeof ReportRepository>;
