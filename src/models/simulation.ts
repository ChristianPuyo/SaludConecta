/**
 * Simulation - Define las interfaces y tipos para simulaciones epidemiológicas.
 * Incluye las entidades de escenarios, parámetros, resultados, gemelos digitales y alertas de vigilancia.
 */
export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  type: 'outbreak' | 'intervention' | 'resource' | 'policy';
  status: 'draft' | 'running' | 'completed' | 'failed';
  parameters: SimulationParameters;
  results?: SimulationResults;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface SimulationParameters {
  populationSize: number;
  infectionRate: number;
  recoveryRate: number;
  mortalityRate: number;
  vaccinationRate: number;
  containmentMeasures: string[];
  timeHorizon: number;
}

export interface SimulationResults {
  totalInfected: number;
  totalRecovered: number;
  totalDeaths: number;
  peakInfectionDate: string;
  peakInfectionCount: number;
  durationDays: number;
  r0: number;
  herdImmunityThreshold: number;
  dailyProjection: SimulationDay[];
}

export interface SimulationDay {
  day: number;
  date: string;
  susceptible: number;
  infected: number;
  recovered: number;
  deceased: number;
  hospitalized: number;
}

export interface DigitalTwin {
  id: string;
  districtId: string;
  name: string;
  population: number;
  healthIndicators: HealthIndicator[];
  riskScore: number;
  predictions: TwinPrediction[];
  lastUpdated: string;
}

export interface HealthIndicator {
  name: string;
  value: number;
  baseline: number;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

export interface TwinPrediction {
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  timeframe: string;
}

export interface VigilanceAlert {
  id: string;
  type: 'outbreak' | 'spike' | 'anomaly' | 'seasonal';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  district: string;
  affectedCount: number;
  timestamp: string;
  status: 'new' | 'acknowledged' | 'investigating' | 'resolved';
  recommendations: string[];
}
