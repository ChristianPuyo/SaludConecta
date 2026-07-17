export const DISTRICTS = ['Callería', 'Yarinacocha', 'Manantay', 'Campoverde', 'Nueva Requena'] as const;

export const SYMPTOMS_LIST = ['Fiebre', 'Diarrea', 'Tos', 'Vómitos', 'Dolor muscular', 'Dolor de cabeza'] as const;

export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

export const VACCINES_DEFAULT = [
  { name: 'BCG (Tuberculosis)', nextDose: 'Al nacer' },
  { name: 'Hepatitis B', nextDose: 'Al nacer' },
  { name: 'Pentavalente', nextDose: '2 meses' },
  { name: 'Polio', nextDose: '2 meses' },
  { name: 'SRP (Sarampión, Rubéola, Paperas)', nextDose: '12 meses' },
  { name: 'Influenza', nextDose: 'Anual' },
  { name: 'COVID-19', nextDose: 'Refuerzo anual' },
  { name: 'Tétanos', nextDose: 'Cada 10 años' },
] as const;

export const COMMUNITY_REPORT_TYPES = [
  { id: 'agua_estancada' as const, label: 'Agua estancada', icon: 'water-outline' },
  { id: 'basura_acumulada' as const, label: 'Basura acumulada', icon: 'trash-outline' },
  { id: 'criaderos_mosquitos' as const, label: 'Criaderos de mosquitos', icon: 'bug-outline' },
  { id: 'animales_muertos' as const, label: 'Animales muertos', icon: 'skull-outline' },
  { id: 'contaminacion' as const, label: 'Contaminación', icon: 'chemical-outline' },
  { id: 'desastre_natural' as const, label: 'Desastre natural', icon: 'warning-outline' },
];

export const EDUCATION_CATEGORIES = [
  { id: 'dengue' as const, label: 'Dengue', icon: 'bug-outline' },
  { id: 'malaria' as const, label: 'Malaria', icon: 'medical-outline' },
  { id: 'covid' as const, label: 'COVID-19', icon: 'shield-outline' },
  { id: 'influenza' as const, label: 'Influenza', icon: 'thermometer-outline' },
  { id: 'salud_infantil' as const, label: 'Salud Infantil', icon: 'happy-outline' },
  { id: 'embarazo' as const, label: 'Embarazo', icon: 'heart-outline' },
  { id: 'nutricion' as const, label: 'Nutrición', icon: 'nutrition-outline' },
  { id: 'primeros_auxilios' as const, label: 'Primeros Auxilios', icon: 'medkit-outline' },
  { id: 'salud_mental' as const, label: 'Salud Mental', icon: 'people-outline' },
  { id: 'prevencion' as const, label: 'Prevención', icon: 'eye-outline' },
  { id: 'general' as const, label: 'General', icon: 'information-circle-outline' },
];

export const MEDICATION_HOURS = ['06:00', '08:00', '12:00', '14:00', '18:00', '20:00', '22:00'];

export const SOS_PHONE = '911';

export const EMERGENCY_LINES = [
  { name: 'SAMU', phone: '106' },
  { name: 'Policía', phone: '105' },
  { name: 'Bomberos', phone: '116' },
  { name: 'MINSA Salud', phone: '113' },
];

export const ACHIEVEMENTS = [
  { id: 'first_report', label: 'Primer reporte', description: 'Realiza tu primer reporte de síntomas', icon: 'flag-outline' },
  { id: 'active_citizen', label: 'Ciudadano activo', description: 'Realiza 10 reportes de síntomas', icon: 'people-outline' },
  { id: 'vaccination_complete', label: 'Vacunación completa', description: 'Registra todas tus vacunas', icon: 'shield-checkmark-outline' },
  { id: 'healthy_community', label: 'Comunidad saludable', description: 'Reporta 5 problemas comunitarios', icon: 'leaf-outline' },
  { id: 'prevention_expert', label: 'Prevención ejemplar', description: 'Lee 10 artículos educativos', icon: 'school-outline' },
  { id: 'health_tracker', label: 'Vigilante de salud', description: 'Registra 30 días de indicadores', icon: 'pulse-outline' },
  { id: 'family_care', label: 'Cuidado familiar', description: 'Agrega 3 miembros a tu familia', icon: 'home-outline' },
];
