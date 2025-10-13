/**
 * @fileoverview Loader & Skeleton - Loading states with spinner and shimmer effects
 * @purpose Provides consistent loading indicators throughout the app
 *
 * COMPONENT CONTRACTS:
 *
 * === LOADER ===
 * Props:
 * - size?: 'small' | 'medium' | 'large' - Spinner size (default: 'medium')
 * - color?: string - Spinner color (defaults to theme.primary)
 * - testID?: string - Testing identifier
 *
 * Visual Specifications:
 * - Type: ActivityIndicator (native spinner)
 * - Sizes: small (20px), medium (36px), large (48px)
 * - Color: theme.colors.primary by default
 * - Centered in container
 *
 * EXAMPLE USAGE:
 * ```tsx
 * <Loader size="large" />
 * <Loader size="small" color={colors.textSecondary} />
 * ```
 *
 * === SKELETON ===
 * Props:
 * - width: number | string - Skeleton width
 * - height: number - Skeleton height
 * - borderRadius?: number - Corner radius (default: 8)
 * - style?: ViewStyle - Additional custom styles
 * - testID?: string - Testing identifier
 *
 * Visual Specifications:
 * - Type: Animated gradient shimmer effect
 * - Base color: theme.colors.card with reduced opacity
 * - Shimmer: Lighter gradient passing across
 * - Animation: 1.5s infinite loop
 * - Border radius: Configurable (default 8px)
 *
 * Behavior:
 * - Shimmer animates left to right continuously
 * - Multiple skeletons can stack to form complex layouts
 * - Respects theme (light/dark mode)
 *
 * EXAMPLE USAGE:
 * ```tsx
 * // Single skeleton
 * <Skeleton width="100%" height={100} />
 *
 * // Profile skeleton
 * <View>
 *   <Skeleton width={64} height={64} borderRadius={32} />
 *   <Skeleton width={200} height={20} />
 *   <Skeleton width={150} height={16} />
 * </View>
 *
 * // Card skeleton
 * <View>
 *   <Skeleton width="100%" height={200} borderRadius={12} />
 *   <Skeleton width="80%" height={24} />
 *   <Skeleton width="60%" height={16} />
 * </View>
 * ```
 *
 * TODO: Add Lottie animation option for loader
 * TODO: Add pulse animation variant for skeleton
 * TODO: Add preset skeleton layouts (card, list item, profile)
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';
import { useThemeColors, useIsDark } from '../../contexts';

// ===== LOADER =====

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  testID?: string;
}

export const Loader = React.memo<LoaderProps>(
  ({ size = 'medium', color, testID }) => {
    const colors = useThemeColors();
    const spinnerColor = color || colors.primary;

    const activitySize = size === 'small' ? 'small' : 'large';

    return (
      <View style={styles.loaderContainer} testID={testID}>
        <ActivityIndicator size={activitySize} color={spinnerColor} />
      </View>
    );
  }
);

Loader.displayName = 'Loader';

// ===== SKELETON =====

interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
  testID?: string;
}

export const Skeleton = React.memo<SkeletonProps>(
  ({ width, height, borderRadius = 8, style, testID }) => {
    const isDark = useIsDark();
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );

      animation.start();

      return () => animation.stop();
    }, [shimmerAnim]);

    const translateX = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-200, 200],
    });

    const baseColor = isDark
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.08)';
    const shimmerColor = isDark
      ? 'rgba(255, 255, 255, 0.18)'
      : 'rgba(255, 255, 255, 0.6)';

    return (
      <View
        style={[
          styles.skeletonContainer,
          {
            width: width as number | `${number}%`,
            height,
            borderRadius,
            backgroundColor: baseColor,
          },
          style,
        ]}
        testID={testID}
      >
        <Animated.View
          style={[
            styles.shimmer,
            {
              transform: [{ translateX }],
              backgroundColor: shimmerColor,
            },
          ]}
        />
      </View>
    );
  }
);

Skeleton.displayName = 'Skeleton';

const styles = StyleSheet.create({
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  skeletonContainer: {
    overflow: 'hidden',
    marginVertical: 4,
  },
  shimmer: {
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
});
