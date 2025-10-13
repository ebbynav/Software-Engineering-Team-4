/**
 * @fileoverview Theme Context - Global theme state management with persistence
 * @purpose Provides theme state, toggle functionality, and color token access across the app
 * @inputs Theme preference from AsyncStorage and system settings
 * @outputs Theme state, toggle functions, and color token objects
 *
 * TODO: Add system theme detection and automatic switching
 * TODO: Implement theme transition animations for complex components
 * TODO: Add high contrast mode support for accessibility
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { lightTokens, darkTokens, ThemeTokens, TokenName } from './tokens';
import { STORAGE_KEYS, THEME_CONFIG } from '../../utils/constants';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  // Theme state
  theme: Theme;
  isDark: boolean;

  // Theme controls
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;

  // Color tokens
  colors: ThemeTokens;
  getColor: (tokenName: TokenName) => string;

  // Loading state
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(THEME_CONFIG.DEFAULT_THEME);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize theme from AsyncStorage or system preference
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        // Try to get saved theme preference
        const savedTheme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);

        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
          setThemeState(savedTheme);
        } else {
          // Fall back to system preference
          const systemTheme = Appearance.getColorScheme();
          const initialTheme = systemTheme === 'dark' ? 'dark' : 'light';
          setThemeState(initialTheme);

          // Save the system preference
          await AsyncStorage.setItem(STORAGE_KEYS.THEME, initialTheme);
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error);
        // Fall back to default theme
        setThemeState(THEME_CONFIG.DEFAULT_THEME);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTheme();
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // Only auto-switch if user hasn't manually set a preference
      AsyncStorage.getItem(STORAGE_KEYS.THEME).then(savedTheme => {
        if (!savedTheme && colorScheme) {
          const newTheme = colorScheme === 'dark' ? 'dark' : 'light';
          setThemeState(newTheme);
        }
      });
    });

    return () => subscription?.remove();
  }, []);

  // Toggle theme function
  const toggleTheme = async () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };

  // Set specific theme
  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };

  // Get current color tokens
  const colors = theme === 'dark' ? darkTokens : lightTokens;

  // Helper function to get color by token name
  const getColor = (tokenName: TokenName): string => {
    return colors[tokenName];
  };

  const value: ThemeContextType = {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme,
    colors,
    getColor,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// Hook to use theme context
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook specifically for accessing theme colors
export function useThemeColors(): ThemeTokens {
  const { colors } = useTheme();
  return colors;
}

// Hook for checking dark mode
export function useIsDark(): boolean {
  const { isDark } = useTheme();
  return isDark;
}
