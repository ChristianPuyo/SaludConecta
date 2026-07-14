export type UserRole = 'citizen' | 'agent' | 'authority';

export interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  icon: string;
}

export const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'citizen',
    title: 'Ciudadano',
    description: 'Reporta síntomas y recibe orientación preventiva.',
    icon: 'person-outline',
  },
  {
    id: 'agent',
    title: 'Agente Comunitario',
    description: 'Registra atenciones y datos de salud en campo.',
    icon: 'medkit-outline',
  },
  {
    id: 'authority',
    title: 'Autoridad / Analista',
    description: 'Monitorea riesgos y toma decisiones con evidencia.',
    icon: 'bar-chart-outline',
  },
];
