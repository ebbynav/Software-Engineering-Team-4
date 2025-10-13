/**
 * PrimaryButton Component
 *
 * An accessible primary action button with proper touch targets and ARIA attributes.
 *
 * ACCESSIBILITY FEATURES:
 * - Minimum 44px touch target (exceeds 44x44 minimum for all platforms)
 * - accessibilityRole="button" for screen readers
 * - accessibilityLabel for custom announcements
 * - accessibilityState for disabled/loading states
 * - accessibilityHint for additional context
 * - High contrast colors meeting WCAG AA standards
 *
 * VISUAL SPECIFICATIONS:
 * - Height: 56px (exceeds 44px minimum)
 * - Minimum width: 44px
 * - Border radius: 12px
 * - Font size: 16px, weight 600
 * - Padding: 16px horizontal
 *
 * BEHAVIOR:
 * - Scale animation on press (0.97)
 * - Loading state with spinner
 * - Disabled state (0.6 opacity, no interaction)
 */

import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useThemeColors } from '../contexts/theme/ThemeContext';

interface PrimaryButtonProps {
  /** Button label */
  label: string;
  /** Press handler */
  onPress: () => void;
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Custom accessibility label (defaults to label) */
  accessibilityLabel?: string;
  /** Additional context for screen readers */
  accessibilityHint?: string;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Full width button */
  fullWidth?: boolean;
  /** Custom style */
  style?: ViewStyle;
  /** Custom text style */
  textStyle?: TextStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = React.memo(
  ({
    label,
    onPress,
    loading = false,
    disabled = false,
    accessibilityLabel,
    accessibilityHint,
    variant = 'primary',
    fullWidth = true,
    style,
    textStyle,
  }) => {
    const colors = useThemeColors();
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      if (!disabled && !loading) {
        Animated.spring(scaleAnim, {
          toValue: 0.97,
          useNativeDriver: true,
        }).start();
      }
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 5,
      }).start();
    };

    const getBackgroundColor = () => {
      if (variant === 'primary') return colors.primary;
      if (variant === 'secondary') return colors.card;
      if (variant === 'danger') return '#EF4444';
      return colors.primary;
    };

    const getTextColor = () => {
      if (variant === 'secondary') return colors.textPrimary;
      return '#FFFFFF';
    };

    const getBorderColor = () => {
      if (variant === 'secondary') return colors.border;
      return 'transparent';
    };

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: getBackgroundColor(),
              borderColor: getBorderColor(),
            },
            fullWidth && styles.fullWidth,
            (disabled || loading) && styles.disabled,
            style,
          ]}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel || label}
          accessibilityState={{
            disabled: disabled || loading,
            busy: loading,
          }}
          accessibilityHint={accessibilityHint}
        >
          {loading ? (
            <ActivityIndicator color={getTextColor()} size="small" />
          ) : (
            <Text style={[styles.label, { color: getTextColor() }, textStyle]}>
              {label}
            </Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

PrimaryButton.displayName = 'PrimaryButton';

const styles = StyleSheet.create({
  button: {
    // Minimum 44px height for accessibility (56px exceeds requirement)
    height: 56,
    minWidth: 44,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
});
