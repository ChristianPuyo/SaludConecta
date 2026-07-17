export type RiskLevel = 'bajo' | 'medio' | 'alto';

export type ReportStatus = 'pendiente' | 'revisado' | 'cerrado';

export type NotificationType =
  | 'riesgo_distrito'
  | 'campania_medica'
  | 'vacunacion'
  | 'alerta_epidemiologica'
  | 'medicamento'
  | 'recomendacion';

export type HealthCenterType = 'hospital' | 'posta' | 'farmacia';

export type CommunityReportType =
  | 'agua_estancada'
  | 'basura_acumulada'
  | 'criaderos_mosquitos'
  | 'animales_muertos'
  | 'contaminacion'
  | 'desastre_natural';

export type CommunityReportStatus = 'pendiente' | 'en_proceso' | 'resuelto';

export type ArticleCategory =
  | 'dengue'
  | 'malaria'
  | 'covid'
  | 'influenza'
  | 'salud_infantil'
  | 'embarazo'
  | 'nutricion'
  | 'primeros_auxilios'
  | 'salud_mental'
  | 'prevencion'
  | 'general';

export type VaccinationStatus = 'recibida' | 'pendiente';

export type FavoriteType = 'article' | 'health_center' | 'campaign';

export type UserRole = 'citizen' | 'agent' | 'authority' | 'admin';
