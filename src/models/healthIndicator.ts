export interface HealthIndicator {
  id: string;
  date: string;
  timestamp: number;
  temperature?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  glucose?: number;
  weight?: number;
  heartRate?: number;
  notes: string;
}
