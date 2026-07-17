/**
 * Campaign - Define las interfaces y tipos para las campañas de salud pública.
 * Incluye las entidades de campaña, recursos, métricas y actividades asociadas.
 */
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
export type CampaignTarget = 'general' | 'age_group' | 'district' | 'risk_group';

export interface Campaign {
  id: string;
  title: string;
  description: string;
  objective: string;
  type: 'vaccination' | 'prevention' | 'screening' | 'awareness' | 'education';
  status: CampaignStatus;
  target: CampaignTarget;
  targetCriteria?: Record<string, string>;
  startDate: string;
  endDate: string;
  coverage?: number;
  participants: number;
  targetParticipants: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  resources: CampaignResource[];
  metrics: CampaignMetrics;
}

export interface CampaignResource {
  id: string;
  type: 'pdf' | 'video' | 'image' | 'link' | 'poster';
  title: string;
  url: string;
}

export interface CampaignMetrics {
  impressions: number;
  reach: number;
  engagement: number;
  conversions: number;
  satisfaction?: number;
}

export interface CampaignActivity {
  id: string;
  campaignId: string;
  type: 'email' | 'sms' | 'notification' | 'visit' | 'event';
  description: string;
  date: string;
  completed: boolean;
  result?: string;
}
