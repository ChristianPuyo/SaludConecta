export type CommunityReportType =
  | 'agua_estancada'
  | 'basura_acumulada'
  | 'criaderos_mosquitos'
  | 'animales_muertos'
  | 'contaminacion';

export type CommunityReportStatus = 'pendiente' | 'en_proceso' | 'resuelto';

export interface CommunityReport {
  id: string;
  type: CommunityReportType;
  description: string;
  location: string;
  district: string;
  community: string;
  date: string;
  timestamp: number;
  status: CommunityReportStatus;
  reporterName: string;
}

export const COMMUNITY_REPORT_LABELS: Record<CommunityReportType, string> = {
  agua_estancada: 'Agua estancada',
  basura_acumulada: 'Basura acumulada',
  criaderos_mosquitos: 'Criaderos de mosquitos',
  animales_muertos: 'Animales muertos',
  contaminacion: 'Contaminación',
};
