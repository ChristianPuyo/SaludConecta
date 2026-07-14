import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export type UserRole = 'citizen' | 'agent' | 'authority';

export interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}

export const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'citizen',
    title: 'Ciudadano',
    description: 'Reporta síntomas y recibe alertas de tu comunidad.',
    icon: 'person-outline',
  },
  {
    id: 'agent',
    title: 'Agente Comunitario',
    description: 'Registra visitas de salud, incluso sin conexión.',
    icon: 'medkit-outline',
  },
  {
    id: 'authority',
    title: 'Autoridad / Analista',
    description: 'Visualiza mapas de riesgo, tendencias y alertas.',
    icon: 'bar-chart-outline',
  },
];

