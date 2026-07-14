export type UserRole = 'citizen' | 'agent' | 'authority';

export interface RoleOption {
  id: UserRole;
  title: string;
  badge: string;
  description: string;
  actionText: string;
  icon: string;
}

export const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'citizen',
    title: 'Ciudadano',
    badge: 'PARA TI Y TU FAMILIA',
    description:
      'Reporta síntomas, recibe orientación y consulta alertas de tu comunidad.',
    actionText: 'Ingresar como ciudadano',
    icon: 'people-outline',
  },
  {
    id: 'agent',
    title: 'Agente comunitario',
    badge: 'TRABAJO DE CAMPO',
    description:
      'Registra visitas, realiza seguimientos y trabaja incluso con conexión limitada.',
    actionText: 'Ingresar como agente',
    icon: 'medkit-outline',
  },
  {
    id: 'authority',
    title: 'Personal de salud',
    badge: 'ACCESO AUTORIZADO',
    description:
      'Consulta casos, mapas de riesgo, tendencias y alertas epidemiológicas.',
    actionText: 'Acceso profesional',
    icon: 'pulse-outline',
  },
];

export const ROLE_HELP: Record<UserRole, string> = {
  citizen:
    'Selecciona esta opción si utilizarás SaludConecta para ti o para tu familia.',
  agent:
    'Selecciona esta opción si realizas visitas, seguimientos o actividades de salud dentro de una comunidad.',
  authority:
    'Selecciona esta opción si perteneces a un centro de salud, una institución sanitaria o necesitas consultar información epidemiológica.',
};
