export const colors = {
  // Primary (Teal - Salud/Confianza)
  primary: '#0F766E',
  primaryLight: '#14B8A6',
  primaryDark: '#115E59',
  primaryMuted: '#99F6E4',

  // Secondary (Blue - Información)
  secondary: '#2563EB',
  secondaryLight: '#60A5FA',
  secondaryDark: '#1D4ED8',

  // Semantic
  danger: '#DC2626',
  dangerLight: '#FCA5A5',
  dangerMuted: '#FEE2E2',
  warning: '#D97706',
  warningLight: '#FCD34D',
  warningMuted: '#FEF3C7',
  success: '#16A34A',
  successLight: '#4ADE80',
  successMuted: '#DCFCE7',
  info: '#7C3AED',
  infoLight: '#A78BFA',
  infoMuted: '#EDE9FE',

  // Surfaces
  background: '#F8FAFC',
  backgroundWarm: '#FFFBF5',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceMuted: '#F1F5F9',

  // Text
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',

  // Borders
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  borderFocus: '#0F766E',

  // Gradients (as arrays for use with LinearGradient)
  gradientPrimary: ['#0F766E', '#14B8A6'] as const,
  gradientDanger: ['#DC2626', '#EF4444'] as const,
  gradientWarning: ['#D97706', '#F59E0B'] as const,
  gradientSuccess: ['#16A34A', '#22C55E'] as const,
  gradientInfo: ['#7C3AED', '#8B5CF6'] as const,
  gradientWarm: ['#FFFBF5', '#FFF7ED'] as const,

  // Shadows (for use in StyleSheet)
  shadowSm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  shadowMd: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  shadowLg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  shadowPrimary: {
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

// Spacing system
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

// Border radius
export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
} as const;

// Typography sizes
export const typography = {
  xs: 11,
  sm: 12,
  md: 14,
  base: 15,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 26,
  hero: 32,
} as const;
