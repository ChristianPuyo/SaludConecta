import type { RiskLevel, ReportStatus } from '../types/health';

export interface SymptomReport {
  id: string;
  date: string;
  timestamp: number;
  district: string;
  community: string;
  symptoms: string[];
  risk: RiskLevel;
  diagnosis: string;
  status: ReportStatus;
  age?: number;
  sex?: string;
  userId?: string;
}
