export const DISTRICTS = ['Callería', 'Yarinacocha', 'Manantay', 'Campoverde', 'Nueva Requena'];

export const SYMPTOMS_LIST = ['Fiebre', 'Diarrea', 'Tos', 'Vómitos', 'Dolor muscular', 'Dolor de cabeza'];

export const COMMUNITY_REPORT_TYPES = [
  { id: 'agua_estancada' as const, label: 'Agua estancada', icon: 'water-outline' },
  { id: 'basura_acumulada' as const, label: 'Basura acumulada', icon: 'trash-outline' },
  { id: 'criaderos_mosquitos' as const, label: 'Criaderos de mosquitos', icon: 'bug-outline' },
  { id: 'animales_muertos' as const, label: 'Animales muertos', icon: 'skull-outline' },
  { id: 'contaminacion' as const, label: 'Contaminación', icon: 'chemical-outline' },
];

export const EDUCATION_CATEGORIES = [
  { id: 'dengue', label: 'Dengue', icon: 'bug-outline' },
  { id: 'covid', label: 'COVID-19', icon: 'shield-outline' },
  { id: 'vacunas', label: 'Vacunas', icon: 'bandage-outline' },
  { id: 'alimentacion', label: 'Alimentación', icon: 'nutrition-outline' },
  { id: 'salud_infantil', label: 'Salud Infantil', icon: 'happy-outline' },
  { id: 'primeros_auxilios', label: 'Primeros Auxilios', icon: 'medkit-outline' },
  { id: 'prevencion', label: 'Prevención', icon: 'eye-outline' },
  { id: 'general', label: 'General', icon: 'information-circle-outline' },
];

export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const APP_VERSION = '2.0.0';
