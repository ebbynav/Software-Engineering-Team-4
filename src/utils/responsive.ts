/**
 * Responsive Layout Utilities
 *
 * Provides responsive breakpoints, orientation detection, and layout helpers
 * for creating adaptive UIs that work on phones and tablets.
 *
 * BREAKPOINTS:
 * - Compact: < 600px (phones in portrait)
 * - Medium: 600-900px (large phones, small tablets)
 * - Expanded: > 900px (tablets in landscape, desktop)
 *
 * USAGE:
 * - useResponsive() hook for current breakpoint
 * - useOrientation() hook for portrait/landscape
 * - Responsive style utilities for adaptive layouts
 */

import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize, Platform } from 'react-native';

export type Breakpoint = 'compact' | 'medium' | 'expanded';
export type Orientation = 'portrait' | 'landscape';

const BREAKPOINTS = {
  compact: 600, // Phone
  medium: 900, // Tablet portrait
  expanded: Infinity, // Tablet landscape
};

/**
 * Get current breakpoint based on window width
 */
export const getBreakpoint = (width: number): Breakpoint => {
  if (width < BREAKPOINTS.compact) return 'compact';
  if (width < BREAKPOINTS.medium) return 'medium';
  return 'expanded';
};

/**
 * Get current orientation based on dimensions
 */
export const getOrientation = (width: number, height: number): Orientation => {
  return width > height ? 'landscape' : 'portrait';
};

/**
 * Hook for responsive breakpoint
 *
 * @returns Current breakpoint ('compact' | 'medium' | 'expanded')
 *
 * @example
 * const breakpoint = useResponsive();
 * const columns = breakpoint === 'compact' ? 1 : breakpoint === 'medium' ? 2 : 3;
 */
export const useResponsive = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
    const { width } = Dimensions.get('window');
    return getBreakpoint(width);
  });

  useEffect(() => {
    const handleChange = ({ window }: { window: ScaledSize }) => {
      setBreakpoint(getBreakpoint(window.width));
    };

    const subscription = Dimensions.addEventListener('change', handleChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  return breakpoint;
};

/**
 * Hook for orientation detection
 *
 * @returns Current orientation ('portrait' | 'landscape')
 *
 * @example
 * const orientation = useOrientation();
 * const imageHeight = orientation === 'portrait' ? 200 : 120;
 */
export const useOrientation = (): Orientation => {
  const [orientation, setOrientation] = useState<Orientation>(() => {
    const { width, height } = Dimensions.get('window');
    return getOrientation(width, height);
  });

  useEffect(() => {
    const handleChange = ({ window }: { window: ScaledSize }) => {
      setOrientation(getOrientation(window.width, window.height));
    };

    const subscription = Dimensions.addEventListener('change', handleChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  return orientation;
};

/**
 * Hook for window dimensions
 *
 * @returns { width, height, breakpoint, orientation }
 */
export const useDimensions = () => {
  const [dimensions, setDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return {
      width,
      height,
      breakpoint: getBreakpoint(width),
      orientation: getOrientation(width, height),
    };
  });

  useEffect(() => {
    const handleChange = ({ window }: { window: ScaledSize }) => {
      setDimensions({
        width: window.width,
        height: window.height,
        breakpoint: getBreakpoint(window.width),
        orientation: getOrientation(window.width, window.height),
      });
    };

    const subscription = Dimensions.addEventListener('change', handleChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  return dimensions;
};

/**
 * Responsive value helper
 *
 * Returns different values based on current breakpoint
 *
 * @example
 * const padding = responsiveValue({ compact: 16, medium: 24, expanded: 32 });
 */
export const responsiveValue = <T>(values: {
  compact?: T;
  medium?: T;
  expanded?: T;
}): T | undefined => {
  const { width } = Dimensions.get('window');
  const breakpoint = getBreakpoint(width);

  if (breakpoint === 'expanded' && values.expanded !== undefined) {
    return values.expanded;
  }
  if (breakpoint === 'medium' && values.medium !== undefined) {
    return values.medium;
  }
  return values.compact;
};

/**
 * Responsive grid columns
 *
 * @param breakpoint - Current breakpoint
 * @returns Number of columns for grid layout
 */
export const getGridColumns = (breakpoint: Breakpoint): number => {
  switch (breakpoint) {
    case 'compact':
      return 1; // Single column on phones
    case 'medium':
      return 2; // Two columns on small tablets
    case 'expanded':
      return 3; // Three columns on large tablets
  }
};

/**
 * Responsive padding
 *
 * @param breakpoint - Current breakpoint
 * @returns Padding value for containers
 */
export const getResponsivePadding = (breakpoint: Breakpoint): number => {
  switch (breakpoint) {
    case 'compact':
      return 16; // Compact padding on phones
    case 'medium':
      return 24; // Medium padding on tablets
    case 'expanded':
      return 32; // Expanded padding on large screens
  }
};

/**
 * Responsive font scale
 *
 * @param breakpoint - Current breakpoint
 * @returns Font scale multiplier
 */
export const getFontScale = (breakpoint: Breakpoint): number => {
  switch (breakpoint) {
    case 'compact':
      return 1.0; // Standard font size
    case 'medium':
      return 1.1; // Slightly larger on tablets
    case 'expanded':
      return 1.15; // Larger on big screens
  }
};

/**
 * Check if device is tablet
 *
 * @returns true if tablet (width >= 600px)
 */
export const isTablet = (): boolean => {
  const { width } = Dimensions.get('window');
  return width >= BREAKPOINTS.compact;
};

/**
 * Check if device is in landscape mode
 *
 * @returns true if landscape
 */
export const isLandscape = (): boolean => {
  const { width, height } = Dimensions.get('window');
  return width > height;
};

/**
 * Responsive style creator
 *
 * Creates style objects that adapt to different breakpoints
 *
 * @example
 * const styles = createResponsiveStyles({
 *   container: {
 *     compact: { padding: 16 },
 *     medium: { padding: 24 },
 *     expanded: { padding: 32 },
 *   },
 * });
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createResponsiveStyles = <
  T extends Record<string, any>,
>(styleMap: {
  [K in keyof T]: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    compact?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    medium?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expanded?: any;
  };
}) => {
  const { width } = Dimensions.get('window');
  const breakpoint = getBreakpoint(width);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const styles: any = {};

  Object.keys(styleMap).forEach(key => {
    const breakpointStyles = styleMap[key];
    if (breakpointStyles) {
      styles[key] =
        breakpoint === 'expanded'
          ? breakpointStyles.expanded ||
            breakpointStyles.medium ||
            breakpointStyles.compact
          : breakpoint === 'medium'
            ? breakpointStyles.medium || breakpointStyles.compact
            : breakpointStyles.compact;
    }
  });

  return styles as T;
};

/**
 * Platform-specific values
 *
 * @example
 * const elevation = platformValue({ ios: 5, android: 3, default: 2 });
 */
export const platformValue = <T>(values: {
  ios?: T;
  android?: T;
  web?: T;
  default: T;
}): T => {
  if (Platform.OS === 'ios' && values.ios !== undefined) return values.ios;
  if (Platform.OS === 'android' && values.android !== undefined)
    return values.android;
  if (Platform.OS === 'web' && values.web !== undefined) return values.web;
  return values.default;
};
