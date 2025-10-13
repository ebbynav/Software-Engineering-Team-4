/**
 * Performance Optimization Utilities
 *
 * Helpers for optimizing React Native app performance, including:
 * - FlatList optimization configurations
 * - Image lazy loading helpers
 * - Memoization utilities
 * - Performance monitoring
 *
 * BEST PRACTICES:
 * - Use React.memo for expensive components
 * - Implement getItemLayout for fixed-height list items
 * - Use keyExtractor with stable IDs
 * - Enable removeClippedSubviews for long lists
 * - Lazy load images with placeholder fallbacks
 */

// Note: ListRenderItemInfo imported but only used in documentation examples

/**
 * Optimized FlatList configuration
 *
 * Returns recommended props for optimal FlatList performance
 *
 * @param itemHeight - Fixed item height (if known)
 * @returns Configuration object to spread into FlatList props
 *
 * @example
 * <FlatList
 *   data={routes}
 *   renderItem={renderRouteCard}
 *   {...getOptimizedFlatListProps(200)}
 * />
 */
import React from 'react';

export const getOptimizedFlatListProps = (itemHeight?: number) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const config: any = {
    // Render batch size for better perceived performance
    initialNumToRender: 10,
    maxToRenderPerBatch: 10,
    windowSize: 5,

    // Remove off-screen items to save memory
    removeClippedSubviews: true,

    // Improve scroll performance
    updateCellsBatchingPeriod: 50,

    // Only re-render changed items
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    keyExtractor: (item: any, index: number) =>
      item.id?.toString() || index.toString(),
  };

  // Add getItemLayout if item height is fixed
  if (itemHeight) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config.getItemLayout = (_: any, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    });
  }

  return config;
};

/**
 * Create a stable keyExtractor function
 *
 * Prevents unnecessary re-renders by providing consistent keys
 *
 * @param idKey - Object property to use as key (default: 'id')
 * @returns keyExtractor function
 */
export const createKeyExtractor = <T extends Record<string, any>>(
  idKey: keyof T = 'id' as keyof T
) => {
  return (item: T, index: number): string => {
    return item[idKey]?.toString() || index.toString();
  };
};

/**
 * Create getItemLayout for fixed-height items
 *
 * Dramatically improves scroll performance for lists with known item heights
 *
 * @param itemHeight - Height of each item in pixels
 * @param includesSeparator - Whether list includes separators (default: false)
 * @param separatorHeight - Height of separator if applicable (default: 0)
 * @returns getItemLayout function
 */
export const createGetItemLayout = (
  itemHeight: number,
  includesSeparator: boolean = false,
  separatorHeight: number = 0
) => {
  const totalItemHeight =
    itemHeight + (includesSeparator ? separatorHeight : 0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (_: any, index: number) => ({
    length: itemHeight,
    offset: totalItemHeight * index,
    index,
  });
};

/**
 * Debounced scroll handler
 *
 * Prevents excessive scroll event processing
 *
 * @param callback - Function to call on scroll
 * @param delay - Debounce delay in ms (default: 100)
 * @returns Debounced scroll handler
 */
export const createDebouncedScrollHandler = (
  callback: () => void,
  delay: number = 100
) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      callback();
      timeoutId = null;
    }, delay);
  };
};

/**
 * Check if component should update (for React.memo)
 *
 * Helper for creating custom comparison functions
 *
 * @param prevProps - Previous props
 * @param nextProps - Next props
 * @param keys - Keys to compare
 * @returns true if props are equal (should NOT update)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const shallowCompare = <T extends Record<string, any>>(
  prevProps: T,
  nextProps: T,
  keys: (keyof T)[]
): boolean => {
  return keys.every(key => prevProps[key] === nextProps[key]);
};

/**
 * Image loading configuration
 *
 * Returns optimized props for Image components
 *
 * @param priority - Loading priority ('low' | 'normal' | 'high')
 * @returns Configuration object for Image component
 */
export const getImageLoadingProps = (
  priority: 'low' | 'normal' | 'high' = 'normal'
) => {
  return {
    // Fade in animation
    fadeDuration: priority === 'high' ? 200 : 300,

    // Progressive rendering (Android)
    progressiveRenderingEnabled: true,

    // Cache control (iOS)
    cache: priority === 'high' ? 'force-cache' : 'default',

    // Resize mode for better performance
    resizeMethod: 'resize' as const,
  };
};

/**
 * Lazy load helper for heavy components
 *
 * Returns a function that conditionally renders component based on visibility
 *
 * @example
 * const LazyMap = lazyLoad(() => import('./MapView'));
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const lazyLoad = <T>(
  importFunc: () => Promise<{ default: React.ComponentType<T> }>
): any => {
  return React.lazy(importFunc);
};

/**
 * Performance monitoring utilities
 */
export const Performance = {
  /**
   * Mark the start of a performance measurement
   */
  markStart: (label: string) => {
    if (__DEV__) {
      console.time(label);
    }
  },

  /**
   * Mark the end of a performance measurement
   */
  markEnd: (label: string) => {
    if (__DEV__) {
      console.timeEnd(label);
    }
  },

  /**
   * Log render count (useful for debugging unnecessary re-renders)
   */
  logRender: (componentName: string, props?: any) => {
    if (__DEV__) {
      console.log(`🔄 ${componentName} rendered`, props);
    }
  },
};

/**
 * Memory management helpers
 */
export const Memory = {
  /**
   * Clear cache for images (useful before unmounting heavy screens)
   */
  clearImageCache: async () => {
    // Implement with react-native-fast-image or similar
    console.log('Clear image cache');
  },

  /**
   * Force garbage collection (development only)
   */
  forceGC: () => {
    if (__DEV__ && global.gc) {
      global.gc();
      console.log('♻️ Garbage collection triggered');
    }
  },
};

/**
 * FlatList optimization example with all best practices
 */
export const OptimizedFlatListExample = `
import { FlatList } from 'react-native';
import { RouteCard } from '@/components/RouteCard';
import { getOptimizedFlatListProps, createKeyExtractor } from '@/utils/performance';

const ROUTE_CARD_HEIGHT = 200; // Fixed height for optimization

const RoutesList = ({ routes, onRoutePress }) => {
  // Memoized render function
  const renderRoute = useCallback(
    ({ item }: ListRenderItemInfo<Route>) => (
      <RouteCard
        {...item}
        onPress={onRoutePress}
      />
    ),
    [onRoutePress]
  );

  return (
    <FlatList
      data={routes}
      renderItem={renderRoute}
      {...getOptimizedFlatListProps(ROUTE_CARD_HEIGHT)}
      // Additional optimizations
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    />
  );
};
`;
