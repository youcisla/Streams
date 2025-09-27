export const colors = {
  // Dark theme base
  background: '#000000',
  surface: '#111111',
  surfaceElevated: '#1a1a1a',
  
  // Primary cyan/aqua
  primary: '#00d4ff',
  primaryDark: '#00a6cc',
  primaryLight: '#33ddff',
  
  // Secondary
  secondary: '#1a1a2e',
  secondaryDark: '#16213e',
  secondaryLight: '#2a2a4e',
  
  // Accent colors
  accent: '#00ffff',
  accentDark: '#00cccc',
  accentLight: '#33ffff',
  
  // Status colors
  success: '#00ff88',
  warning: '#ffaa00',
  error: '#ff4444',
  info: '#0099ff',
  
  // Text colors
  textPrimary: '#ffffff',
  textSecondary: '#cccccc',
  textMuted: '#888888',
  textDisabled: '#555555',
  
  // Border colors
  border: '#333333',
  borderLight: '#444444',
  borderFocus: '#00d4ff',
  
  // Transparent overlays
  overlay: 'rgba(0, 0, 0, 0.8)',
  overlayLight: 'rgba(0, 0, 0, 0.6)',
  
  // Platform colors
  twitch: '#9146ff',
  youtube: '#ff0000',
  kick: '#53fc18',
  instagram: '#e4405f',
  tiktok: '#fe2c55',
  x: '#000000'
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999
};

export const fonts = {
  regular: {
    fontFamily: 'System',
    fontWeight: '400' as const
  },
  medium: {
    fontFamily: 'System',
    fontWeight: '500' as const
  },
  semiBold: {
    fontFamily: 'System',
    fontWeight: '600' as const
  },
  bold: {
    fontFamily: 'System',
    fontWeight: '700' as const
  }
};

export const typography = {
  h1: {
    ...fonts.bold,
    fontSize: 32,
    lineHeight: 40,
    color: colors.textPrimary
  },
  h2: {
    ...fonts.bold,
    fontSize: 28,
    lineHeight: 36,
    color: colors.textPrimary
  },
  h3: {
    ...fonts.semiBold,
    fontSize: 24,
    lineHeight: 32,
    color: colors.textPrimary
  },
  h4: {
    ...fonts.semiBold,
    fontSize: 20,
    lineHeight: 28,
    color: colors.textPrimary
  },
  body: {
    ...fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary
  },
  bodySmall: {
    ...fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary
  },
  caption: {
    ...fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textMuted
  },
  button: {
    ...fonts.semiBold,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary
  }
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8
  }
};

export const theme = {
  colors,
  spacing,
  borderRadius,
  fonts,
  typography,
  shadows
};

export type Theme = typeof theme;