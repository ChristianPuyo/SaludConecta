import type { CommunityReport, CommunityReportStatus } from '../models/communityReport';
import { StorageService } from './storage';

const KEY = 'community_reports';

export const CommunityReportService = {
  async getAll(): Promise<CommunityReport[]> {
    return (await StorageService.get<CommunityReport[]>(KEY)) ?? [];
  },

  async add(report: Omit<CommunityReport, 'id' | 'timestamp' | 'status' | 'date'>): Promise<CommunityReport> {
    const all = await this.getAll();
    const newReport: CommunityReport = {
      ...report,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      timestamp: Date.now(),
      status: 'pendiente',
    };
    all.unshift(newReport);
    await StorageService.set(KEY, all);
    return newReport;
  },

  async updateStatus(id: string, status: CommunityReportStatus): Promise<void> {
    const all = await this.getAll();
    const idx = all.findIndex((r) => r.id === id);
    if (idx !== -1) {
      all[idx].status = status;
      await StorageService.set(KEY, all);
    }
  },

  async getByDistrict(district: string): Promise<CommunityReport[]> {
    const all = await this.getAll();
    return all.filter((r) => r.district === district);
  },

  async getByStatus(status: CommunityReportStatus): Promise<CommunityReport[]> {
    const all = await this.getAll();
    return all.filter((r) => r.status === status);
  },
};
