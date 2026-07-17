export type HealthCenterType = 'hospital' | 'posta' | 'farmacia';

export interface HealthCenter {
  id: string;
  name: string;
  type: HealthCenterType;
  address: string;
  phone: string;
  hours: string;
  services: string[];
  district: string;
  community: string;
  lat?: number;
  lng?: number;
}
