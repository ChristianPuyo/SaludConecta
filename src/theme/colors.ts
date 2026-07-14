export const colors = {
  primary: '#0F766E',          // Teal 700 (Brand Primary)
  primaryLight: '#F0FDFA',     // Teal 50 (Soft Primary BG)
  primaryBorder: '#CCFBF1',    // Teal 100
  primaryDark: '#115E59',      // Teal 800 (Primary text emphasis)
  primaryGlow: 'rgba(15, 118, 110, 0.15)',

  secondary: '#6366F1',        // Indigo 500 (Brand Accent)
  secondaryLight: '#EEF2FF',   // Indigo 50 (Soft Accent BG)
  secondaryBorder: '#E0E7FF',  // Indigo 100
  secondaryDark: '#4F46E5',    // Indigo 600
  secondaryGlow: 'rgba(99, 102, 241, 0.12)',

  success: '#10B981',          // Emerald 500
  successLight: '#ECFDF5',     // Emerald 50
  successBorder: '#D1FAE5',    // Emerald 100
  successDark: '#047857',      // Emerald 700

  warning: '#F59E0B',          // Amber 500
  warningLight: '#FFFBEB',     // Amber 50
  warningBorder: '#FEF3C7',    // Amber 100
  warningDark: '#B45309',      // Amber 700

  danger: '#EF4444',           // Rose/Red 500
  dangerLight: '#FEF2F2',      // Rose/Red 50
  dangerBorder: '#FEE2E2',     // Rose/Red 100
  dangerDark: '#B91C1C',       // Rose/Red 700

  background: '#FAFBFD',       // Slate 50 (Warm tint for app background)
  surface: '#FFFFFF',          // Solid surface for cards/elevation
  surfaceMuted: '#F8FAFC',     // Slate 50 for nested panels
  surfaceOverlay: 'rgba(15, 23, 42, 0.04)',

  textPrimary: '#0F172A',      // Slate 900 (High contrast body & headings)
  textSecondary: '#475569',    // Slate 600 (Secondary label text)
  textMuted: '#64748B',        // Slate 500 (Muted / captions)
  textPlaceholder: '#94A3B8',  // Slate 400

  border: '#E2E8F0',           // Slate 200 (Default line)
  borderLight: '#F1F5F9',      // Slate 100 (Secondary dividers)
  borderFocus: '#0F766E',      // Primary focal ring
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  headerHeight: 64,
};

export const borderRadius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24,
  round: 999,
};

export const shadows = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '900', letterSpacing: -0.8 },
  h2: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  h3: { fontSize: 18, fontWeight: '800', letterSpacing: -0.2 },
  bodyLarge: { fontSize: 16, fontWeight: '500', lineHeight: 22 },
  bodyMedium: { fontSize: 14, fontWeight: '500', lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '600', letterSpacing: 0.2 },
  badge: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' },
};
