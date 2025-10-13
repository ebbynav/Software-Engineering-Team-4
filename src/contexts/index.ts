/**
 * @fileoverview Contexts Index - React Context providers for global state
 * @purpose Manages app-wide state (theme, authentication) using React Context
 * @inputs Context provider props and initial state values
 * @outputs Context providers and hooks for consuming global state
 *
 * TODO: Implement AuthContext with mock authentication state management
 * TODO: Add auth persistence using AsyncStorage key @waytrove_auth
 * TODO: Connect contexts to Django REST API authentication endpoints
 */

// Theme Context exports
export {
  ThemeProvider,
  useTheme,
  useThemeColors,
  useIsDark,
} from './theme/ThemeContext';

export type { Theme } from './theme/ThemeContext';
export type { ThemeTokens, TokenName } from './theme/tokens';
export { lightTokens, darkTokens, getMapStyleName } from './theme/tokens';

// Placeholder exports - will be populated as contexts are implemented
// export { AuthProvider, useAuth } from './AuthContext';
