/**
 * @fileoverview Hooks Index - Custom React hooks for reusable logic
 * @purpose Provides custom hooks for theme management, authentication, and common utilities
 * @inputs Hook-specific parameters (debounce delay, API endpoints, etc.)
 * @outputs Hook return values (state, handlers, computed values)
 */

export { useDebouncedValue } from './useDebouncedValue';
export { useAsyncStorage } from './useAsyncStorage';
export { useMockData } from './useMockData';
export type { StorageKey, StorageValue } from './useAsyncStorage';
export type {
  MockDataFile,
  UseMockDataOptions,
  UseMockDataReturn,
} from './useMockData';

// TODO: Implement useTheme hook for accessing and toggling app theme
// TODO: Implement useAuth hook for authentication state and actions
// TODO: Add useAPI hook for standardized API calls to Django backend
