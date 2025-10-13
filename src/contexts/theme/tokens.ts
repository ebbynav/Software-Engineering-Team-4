/**
 * @fileoverview Theme Tokens - Design system color tokens for light and dark modes
 * @purpose Defines comprehensive color palettes following WayTrove design system
 * @inputs None (static color definitions)
 * @outputs Light and dark theme color token objects
 *
 * TODO: Ensure colors meet WCAG accessibility contrast requirements
 * TODO: Test color combinations in various lighting conditions
 * TODO: Add semantic color mappings for specific use cases
 */

export interface ThemeTokens {
  // Background colors
  background: string;
  backgroundSecondary: string;
  card: string;
  cardSecondary: string;

  // Text colors
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;

  // Brand colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  accent: string;
  accentLight: string;
  accentDark: string;

  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // UI colors
  border: string;
  borderLight: string;
  borderDark: string;
  divider: string;
  overlay: string;
  shadow: string;

  // Interactive colors
  buttonPrimary: string;
  buttonSecondary: string;
  buttonText: string;
  buttonTextSecondary: string;

  // Elevation colors (for cards, modals, etc.)
  elevation: string;
  elevationLight: string;
  elevationHigh: string;

  // Muted colors (for disabled states, placeholders)
  muted: string;
  mutedLight: string;
  mutedDark: string;
}

// Light theme tokens
export const lightTokens: ThemeTokens = {
  // Background colors
  background: '#F8F8FC',
  backgroundSecondary: '#FFFFFF',
  card: '#FFFFFF',
  cardSecondary: '#F5F5F7',

  // Text colors
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',

  // Brand colors
  primary: '#6C63FF',
  primaryLight: '#8B82FF',
  primaryDark: '#5A52E5',
  secondary: '#00C2CB',
  secondaryLight: '#33D1D9',
  secondaryDark: '#00A8B0',
  accent: '#A78BFA',
  accentLight: '#C4B5FD',
  accentDark: '#8B5FBF',

  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // UI colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderDark: '#D1D5DB',
  divider: '#E5E7EB',
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.1)',

  // Interactive colors
  buttonPrimary: '#6C63FF',
  buttonSecondary: '#F9FAFB',
  buttonText: '#FFFFFF',
  buttonTextSecondary: '#374151',

  // Elevation colors
  elevation: '#FFFFFF',
  elevationLight: '#FAFAFA',
  elevationHigh: '#F5F5F5',

  // Muted colors
  muted: '#9CA3AF',
  mutedLight: '#D1D5DB',
  mutedDark: '#6B7280',
};

// Dark theme tokens
export const darkTokens: ThemeTokens = {
  // Background colors
  background: '#0B1020',
  backgroundSecondary: '#0F1724',
  card: '#0F1724',
  cardSecondary: '#1F2937',

  // Text colors
  textPrimary: '#E6EEF8',
  textSecondary: '#9CA3AF',
  textTertiary: '#6B7280',
  textInverse: '#111827',

  // Brand colors
  primary: '#8B82FF',
  primaryLight: '#A5A0FF',
  primaryDark: '#6C63FF',
  secondary: '#33D1D9',
  secondaryLight: '#66E0E6',
  secondaryDark: '#00C2CB',
  accent: '#C4B5FD',
  accentLight: '#DDD6FE',
  accentDark: '#A78BFA',

  // Status colors
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',

  // UI colors
  border: '#374151',
  borderLight: '#4B5563',
  borderDark: '#1F2937',
  divider: '#374151',
  overlay: 'rgba(0, 0, 0, 0.7)',
  shadow: 'rgba(0, 0, 0, 0.3)',

  // Interactive colors
  buttonPrimary: '#8B82FF',
  buttonSecondary: '#374151',
  buttonText: '#FFFFFF',
  buttonTextSecondary: '#E5E7EB',

  // Elevation colors
  elevation: '#1F2937',
  elevationLight: '#374151',
  elevationHigh: '#4B5563',

  // Muted colors
  muted: '#6B7280',
  mutedLight: '#9CA3AF',
  mutedDark: '#4B5563',
};

// Token name type for type safety
export type TokenName = keyof ThemeTokens;

// Helper function to get all token names
export const getTokenNames = (): TokenName[] => {
  return Object.keys(lightTokens) as TokenName[];
};

// Map style suggestions for map components
export const getMapStyleName = (isDark: boolean): string => {
  return isDark ? 'dark-v10' : 'light-v10';
};

// Animation duration constants
export const THEME_TRANSITION_DURATION = {
  BACKGROUND: 200,
  COLORS: 300,
  FAST: 150,
  NORMAL: 250,
  SLOW: 400,
} as const;
