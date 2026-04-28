// CommunityPulse — Design System Tokens (from Stitch)
export const Colors = {
  primary: '#00694C',
  primaryContainer: '#008560',
  primaryFixed: '#86F8C9',
  primaryFixedDim: '#68DBAE',

  secondary: '#1960A6',
  secondaryContainer: '#7AB3FF',
  secondaryFixed: '#D4E3FF',
  secondaryFixedDim: '#A3C4FF',

  tertiary: '#554CB9',
  tertiaryContainer: '#6E66D4',
  tertiaryFixed: '#E3DFFF',

  error: '#BA1A1A',
  errorContainer: '#FFDAD6',

  background: '#F5FBF5',
  surface: '#F5FBF5',
  surfaceBright: '#F5FBF5',
  surfaceContainer: '#EAEFEa',
  surfaceContainerHigh: '#E4EAE4',
  surfaceContainerHighest: '#DEE4DE',
  surfaceContainerLow: '#EFF5EF',
  surfaceContainerLowest: '#FFFFFF',
  surfaceDim: '#D6DBD6',
  surfaceVariant: '#DEE4DE',
  surfaceTint: '#006C4E',

  onBackground: '#171D1A',
  onSurface: '#171D1A',
  onSurfaceVariant: '#3D4943',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#F5FFF7',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#00447E',
  onTertiary: '#FFFFFF',
  onTertiaryContainer: '#FFFBFF',
  onError: '#FFFFFF',

  outline: '#6D7A73',
  outlineVariant: '#BCCAC1',

  // Semantic urgency
  urgent: '#BA1A1A',
  high: '#E65100',
  medium: '#F57F17',
  covered: '#00694C',

  // Status
  statusActive: '#00694C',
  statusPending: '#1960A6',
  statusClosed: '#6D7A73',

};

export const Typography = {
  displayMd: { fontSize: 44, fontWeight: '700', letterSpacing: -0.88 },
  headlineLg: { fontSize: 32, fontWeight: '700', letterSpacing: -0.64 },
  headlineMd: { fontSize: 24, fontWeight: '700', letterSpacing: -0.48 },
  headlineSm: { fontSize: 20, fontWeight: '600', letterSpacing: -0.4 },
  titleLg: { fontSize: 18, fontWeight: '600', letterSpacing: -0.36 },
  titleMd: { fontSize: 16, fontWeight: '600' },
  titleSm: { fontSize: 14, fontWeight: '600' },
  bodyLg: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodyMd: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  bodySm: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  labelLg: { fontSize: 14, fontWeight: '500', letterSpacing: 0.1 },
  labelMd: { fontSize: 12, fontWeight: '500', letterSpacing: 0.5, textTransform: 'uppercase' },
  labelSm: { fontSize: 10, fontWeight: '500', letterSpacing: 0.5, textTransform: 'uppercase' },
};

export const Radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
};

export const Shadow = {
  soft: {
    shadowColor: '#171D1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  float: {
    shadowColor: '#171D1A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 32,
    elevation: 6,
  },
};
