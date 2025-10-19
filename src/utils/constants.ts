/**
 * @fileoverview App Constants - Central constants for WayTrove application
 * @purpose Provides app-wide constants for AsyncStorage keys, API endpoints, and configuration
 * @inputs None (constants only)
 * @outputs Constant values used throughout the application
 *
 * TODO: Update API_BASE_URL when backend environment is configured
 * TODO: Add map provider constants when map integration is implemented
 * TODO: Add feature flags for A/B testing and gradual rollouts
 */

// AsyncStorage Keys - must match the specification
export const STORAGE_KEYS = {
  THEME: '@waytrove_theme',
  AUTH: '@waytrove_auth',
  HAS_SEEN_ONBOARDING: '@waytrove_has_seen_onboarding',
  USER_PROFILE: '@waytrove_user_profile',
} as const;

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.DJANGO_API_URL || 'http://localhost:8000/api',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
} as const;

// API Endpoints - TODO: Update when Django REST API is finalized
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  PROFILE: '/auth/profile',

  // Destinations & Routes
  DESTINATIONS: '/destinations',
  ROUTES: '/routes',
  SEARCH: '/search',

  // User Content
  BOOKMARKS: '/bookmarks',
  POSTS: '/posts',

  // Safety & Alerts
  SAFETY_ALERTS: '/safety-alerts',
} as const;

// Theme Configuration
export const THEME_CONFIG = {
  DEFAULT_THEME: 'light' as const,
  ANIMATION_DURATION: 200,
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: 'WayTrove',
  VERSION: '1.0.0',
  BUILD_NUMBER: 1,
  SUPPORTED_LANGUAGES: ['en', 'es', 'fr', 'de', 'ja'] as const,
  DEFAULT_LANGUAGE: 'en',
} as const;

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_REGION: {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  MAPBOX_API_KEY: process.env.MAPBOX_API_KEY,
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
} as const;
