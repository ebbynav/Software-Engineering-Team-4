/**
 * @fileoverview Theme Toggle Component - Animated theme switching button
 * @purpose Provides an interactive toggle button for switching between light and dark themes
 * @inputs Optional style props and onToggle callback
 * @outputs Animated toggle button with sun/moon icons and smooth transitions
 *
 * TODO: Add haptic feedback for iOS/Android
 * TODO: Add accessibility announcements for theme changes
 * TODO: Consider adding custom icon options
 */

import React from 'react';
import { TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/theme/ThemeContext';
import { THEME_TRANSITION_DURATION } from '../contexts/theme/tokens';

interface ThemeToggleProps {
  size?: number;
  style?: Record<string, unknown>;
  onToggle?: () => void;
}

export function ThemeToggle({ size = 24, style, onToggle }: ThemeToggleProps) {
  const { isDark, toggleTheme, colors } = useTheme();

  // Animation values - all using native driver for better performance
  const [rotateAnim] = React.useState(new Animated.Value(isDark ? 1 : 0));
  const [scaleAnim] = React.useState(new Animated.Value(1));

  // Update animations when theme changes
  React.useEffect(() => {
    const toValue = isDark ? 1 : 0;

    Animated.timing(rotateAnim, {
      toValue,
      duration: THEME_TRANSITION_DURATION.COLORS,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    }).start();
  }, [isDark, rotateAnim]);

  const handlePress = () => {
    // Scale animation for press feedback
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: THEME_TRANSITION_DURATION.FAST,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: THEME_TRANSITION_DURATION.FAST,
        useNativeDriver: true,
      }),
    ]).start();

    toggleTheme();
    onToggle?.();
  };

  // Interpolated values
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // Use current theme colors directly instead of animating them
  // This avoids mixing native and JS-driven animations
  const iconColor = isDark ? colors.primary : colors.warning;
  const backgroundColor = colors.card;
  const borderColor = colors.border;

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[styles.container, style]}
      accessibilityRole="button"
      accessibilityLabel={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      accessibilityHint="Toggles between light and dark app themes"
    >
      <Animated.View
        style={[
          styles.toggleButton,
          {
            backgroundColor,
            borderColor,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ rotate: rotation }],
            },
          ]}
        >
          <Animated.Text style={{ color: iconColor }}>
            <Ionicons name={isDark ? 'moon' : 'sunny'} size={size} />
          </Animated.Text>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
