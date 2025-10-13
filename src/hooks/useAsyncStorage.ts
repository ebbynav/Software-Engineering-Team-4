/**
 * @fileoverview useAsyncStorage Hook
 * @purpose Typed helpers for reading/writing AsyncStorage with common app keys
 *
 * This hook provides a type-safe interface for working with AsyncStorage,
 * commonly used for persisting user preferences, authentication tokens,
 * and onboarding state across app sessions.
 *
 * Supported Storage Keys:
 * - theme: 'light' | 'dark' | 'system'
 * - authToken: string (JWT access token)
 * - refreshToken: string (JWT refresh token)
 * - onboardingComplete: boolean
 * - userId: string
 * - userProfile: User object
 *
 * @example
 * ```tsx
 * const { getValue, setValue, removeValue } = useAsyncStorage();
 *
 * // Save theme preference
 * await setValue('theme', 'dark');
 *
 * // Load theme on app start
 * const savedTheme = await getValue('theme');
 *
 * // Clear auth tokens on logout
 * await removeValue('authToken');
 * await removeValue('refreshToken');
 * ```
 */

import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage keys with their value types
 */
export type StorageKey =
  | 'theme'
  | 'authToken'
  | 'refreshToken'
  | 'onboardingComplete'
  | 'userId'
  | 'userProfile'
  | 'savedRoutes'
  | 'savedNews'
  | 'recentSearches';

/**
 * Type mapping for storage values
 */
export type StorageValue<K extends StorageKey> = K extends 'theme'
  ? 'light' | 'dark' | 'system'
  : K extends 'authToken'
    ? string
    : K extends 'refreshToken'
      ? string
      : K extends 'onboardingComplete'
        ? boolean
        : K extends 'userId'
          ? string
          : K extends 'userProfile'
            ? object
            : K extends 'savedRoutes'
              ? string[]
              : K extends 'savedNews'
                ? string[]
                : K extends 'recentSearches'
                  ? string[]
                  : string;

/**
 * Hook return type
 */
interface UseAsyncStorageReturn {
  getValue: <K extends StorageKey>(key: K) => Promise<StorageValue<K> | null>;
  setValue: <K extends StorageKey>(
    key: K,
    value: StorageValue<K>
  ) => Promise<void>;
  removeValue: (key: StorageKey) => Promise<void>;
  clearAll: () => Promise<void>;
  loading: boolean;
  error: Error | null;
}

/**
 * Custom hook for type-safe AsyncStorage operations
 *
 * @returns Object with getValue, setValue, removeValue, and clearAll methods
 *
 * @example
 * // Basic usage
 * const storage = useAsyncStorage();
 *
 * // Save data
 * await storage.setValue('theme', 'dark');
 * await storage.setValue('onboardingComplete', true);
 *
 * // Read data
 * const theme = await storage.getValue('theme');
 * const onboarded = await storage.getValue('onboardingComplete');
 *
 * // Remove data
 * await storage.removeValue('authToken');
 *
 * // Clear everything (use cautiously!)
 * await storage.clearAll();
 */
export function useAsyncStorage(): UseAsyncStorageReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Get a value from AsyncStorage
   */
  const getValue = useCallback(
    async <K extends StorageKey>(key: K): Promise<StorageValue<K> | null> => {
      setLoading(true);
      setError(null);

      try {
        const value = await AsyncStorage.getItem(key);

        if (value === null) {
          return null;
        }

        // Parse JSON values (objects, arrays, booleans)
        if (
          value.startsWith('{') ||
          value.startsWith('[') ||
          value === 'true' ||
          value === 'false'
        ) {
          return JSON.parse(value) as StorageValue<K>;
        }

        // Return string values as-is
        return value as StorageValue<K>;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to get value');
        setError(error);
        console.error(`AsyncStorage getValue error for key "${key}":`, error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Set a value in AsyncStorage
   */
  const setValue = useCallback(
    async <K extends StorageKey>(
      key: K,
      value: StorageValue<K>
    ): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        // Stringify non-string values
        const stringValue =
          typeof value === 'string' ? value : JSON.stringify(value);

        await AsyncStorage.setItem(key, stringValue);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to set value');
        setError(error);
        console.error(`AsyncStorage setValue error for key "${key}":`, error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Remove a value from AsyncStorage
   */
  const removeValue = useCallback(async (key: StorageKey): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await AsyncStorage.removeItem(key);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to remove value');
      setError(error);
      console.error(`AsyncStorage removeValue error for key "${key}":`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear all AsyncStorage data
   * ⚠️ Use with caution - this removes ALL stored data
   */
  const clearAll = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await AsyncStorage.clear();
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to clear storage');
      setError(error);
      console.error('AsyncStorage clearAll error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getValue,
    setValue,
    removeValue,
    clearAll,
    loading,
    error,
  };
}

/**
 * Usage Examples:
 *
 * 1. Persisting Theme Preference
 * --------------------------------
 * const storage = useAsyncStorage();
 *
 * // Save theme when user changes it
 * const handleThemeChange = async (newTheme: 'light' | 'dark') => {
 *   await storage.setValue('theme', newTheme);
 *   applyTheme(newTheme);
 * };
 *
 * // Load theme on app start
 * useEffect(() => {
 *   const loadTheme = async () => {
 *     const savedTheme = await storage.getValue('theme');
 *     if (savedTheme) {
 *       applyTheme(savedTheme);
 *     }
 *   };
 *   loadTheme();
 * }, []);
 *
 *
 * 2. Authentication Token Management
 * -----------------------------------
 * const storage = useAsyncStorage();
 *
 * // Save tokens after login
 * const handleLogin = async (tokens: AuthTokens) => {
 *   await storage.setValue('authToken', tokens.accessToken);
 *   await storage.setValue('refreshToken', tokens.refreshToken);
 *   await storage.setValue('userId', tokens.userId);
 * };
 *
 * // Load tokens on app start
 * const restoreSession = async () => {
 *   const authToken = await storage.getValue('authToken');
 *   const userId = await storage.getValue('userId');
 *
 *   if (authToken && userId) {
 *     // User is logged in, navigate to main app
 *     setIsAuthenticated(true);
 *   }
 * };
 *
 * // Logout and clear tokens
 * const handleLogout = async () => {
 *   await storage.removeValue('authToken');
 *   await storage.removeValue('refreshToken');
 *   await storage.removeValue('userId');
 *   setIsAuthenticated(false);
 * };
 *
 *
 * 3. Onboarding State
 * --------------------
 * const storage = useAsyncStorage();
 *
 * // Check if user has completed onboarding
 * const checkOnboarding = async () => {
 *   const completed = await storage.getValue('onboardingComplete');
 *
 *   if (!completed) {
 *     navigation.navigate('Onboarding');
 *   } else {
 *     navigation.navigate('Home');
 *   }
 * };
 *
 * // Mark onboarding as complete
 * const completeOnboarding = async () => {
 *   await storage.setValue('onboardingComplete', true);
 *   navigation.replace('Home');
 * };
 *
 *
 * 4. Saved Items Lists
 * ---------------------
 * const storage = useAsyncStorage();
 *
 * // Save a route
 * const saveRoute = async (routeId: string) => {
 *   const saved = await storage.getValue('savedRoutes') || [];
 *   if (!saved.includes(routeId)) {
 *     await storage.setValue('savedRoutes', [...saved, routeId]);
 *   }
 * };
 *
 * // Load saved routes
 * const loadSavedRoutes = async () => {
 *   const saved = await storage.getValue('savedRoutes');
 *   setSavedRoutes(saved || []);
 * };
 *
 *
 * 5. Recent Searches
 * -------------------
 * const storage = useAsyncStorage();
 *
 * // Add to recent searches (max 10)
 * const addRecentSearch = async (query: string) => {
 *   const recent = await storage.getValue('recentSearches') || [];
 *   const updated = [query, ...recent.filter(q => q !== query)].slice(0, 10);
 *   await storage.setValue('recentSearches', updated);
 * };
 *
 *
 * Best Practices:
 * ---------------
 * - Always check for null return values
 * - Handle errors appropriately (loading states, error messages)
 * - Don't store sensitive data without encryption
 * - Use specific keys instead of generic ones
 * - Clear tokens on logout
 * - Validate data after retrieval (could be corrupted)
 * - Consider migration strategy if data structure changes
 *
 *
 * Security Notes:
 * ---------------
 * - AsyncStorage is NOT encrypted by default
 * - For sensitive data, consider using expo-secure-store
 * - Never store passwords or credit card numbers
 * - Auth tokens should be short-lived (use refresh tokens)
 * - Clear sensitive data on logout
 */
