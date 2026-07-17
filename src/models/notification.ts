export type NotificationType =
  | 'riesgo_distrito'
  | 'campania_medica'
  | 'vacunacion'
  | 'alerta_epidemiologica'
  | 'medicamento'
  | 'recomendacion';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  read: boolean;
  date: string;
  timestamp: number;
  data?: Record<string, string>;
}
