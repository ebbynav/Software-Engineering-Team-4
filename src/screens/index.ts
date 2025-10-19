/**
 * @fileoverview Screens Index - App screen components
 * @purpose Central export point for all screen-level components with simple default exports
 * @inputs Navigation props (route, navigation) and screen-specific parameters
 * @outputs Full-screen React Native components for navigation stack
 */

// Demo and Development Screens
export { default as ThemeDemoScreen } from './ThemeDemoScreen';

// Authentication Flow
export { default as OnboardingScreen } from './OnboardingScreen';
export { default as LoginScreen } from './LoginScreen';

// Main App Screens
export { default as HomeScreen } from './HomeScreen';
export { default as ExploreScreen } from './ExploreScreen';
export { default as SafetyScreen } from './SafetyScreen';
export { default as NewsScreen } from './NewsScreen';
export { default as ProfileScreen } from './ProfileScreen';
export { default as EditProfile } from './EditProfile';

// Modal/Detail Screens
export { default as RouteDetailsScreen } from './RouteDetailsScreen';
export { default as NewsDetailsScreen } from './NewsDetailsScreen';
export { default as SafeRouteScreen } from './SafeRouteScreen';
export { default as SettingsScreen } from './SettingsScreen';
