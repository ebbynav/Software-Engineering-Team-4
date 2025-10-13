/**
 * @fileoverview PrimaryButton - Main action button with loading and disabled states
 * @purpose Provides consistent primary action button across the app
 *
 * COMPONENT CONTRACT:
 *
 * Props:
 * - label: string - Button text content
 * - onPress: () => void - Handler called when button is pressed
 * - loading?: boolean - Shows loading spinner, disables interaction
 * - disabled?: boolean - Disables button, reduces opacity
 * - icon?: string - Optional emoji or icon to show before label
 * - style?: ViewStyle - Additional custom styles
 * - testID?: string - Testing identifier
 *
 * Visual Specifications:
 * - Shape: Pill-shaped (fully rounded corners)
 * - Background: theme.colors.primary
 * - Text: White, 16px, semibold (600)
 * - Height: 56px (comfortable touch target)
 * - Padding: 24px horizontal
 * - Shadow: Subtle elevation (iOS shadow, Android elevation)
 * - Loading: Replaces label with ActivityIndicator
 * - Disabled: 50% opacity, no interaction
 *
 * Behavior:
 * - Disabled when loading=true or disabled=true
 * - Loading state shows spinner, hides label
 * - Haptic feedback on press (optional)
 * - Scale animation on press (0.98)
 *
 * Accessibility:
 * - accessibilityRole="button"
 * - accessibilityLabel defaults to label prop
 * - accessibilityState includes disabled state
 * - Minimum touch target: 44x44 (enforced by height)
 *
 * EXAMPLE USAGE:
 * ```tsx
 * // Basic usage
 * <PrimaryButton label="Sign In" onPress={handleSignIn} />
 *
 * // With icon
 * <PrimaryButton label="Continue" onPress={handleNext} icon="→" />
 *
 * // Loading state
 * <PrimaryButton label="Saving..." onPress={handleSave} loading={isLoading} />
 *
 * // Disabled state
 * <PrimaryButton label="Submit" onPress={handleSubmit} disabled={!isValid} />
 * ```
 *
 * TODO: Add haptic feedback using expo-haptics
 * TODO: Support secondary/tertiary button variants
 * TODO: Add custom Lottie loading animation option
 */

import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  Animated,
  ViewStyle,
  Platform,
} from 'react-native';
import { useThemeColors } from '../../contexts';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  style?: ViewStyle;
  testID?: string;
}

export const PrimaryButton = React.memo<PrimaryButtonProps>(
  ({
    label,
    onPress,
    loading = false,
    disabled = false,
    icon,
    style,
    testID,
  }) => {
    const colors = useThemeColors();
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const isDisabled = disabled || loading;

    const handlePressIn = () => {
      if (!isDisabled) {
        Animated.spring(scaleAnim, {
          toValue: 0.98,
          useNativeDriver: true,
        }).start();
      }
    };

    const handlePressOut = () => {
      if (!isDisabled) {
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }).start();
      }
    };

    const handlePress = () => {
      if (!isDisabled) {
        onPress();
      }
    };

    return (
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
        <TouchableOpacity
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isDisabled}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityState={{ disabled: isDisabled, busy: loading }}
          testID={testID}
          style={[
            styles.button,
            {
              backgroundColor: colors.primary,
              opacity: isDisabled ? 0.5 : 1,
            },
            Platform.OS === 'ios' ? styles.shadowIOS : styles.shadowAndroid,
          ]}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              {icon && <Text style={styles.icon}>{icon}</Text>}
              <Text style={styles.label}>{label}</Text>
            </>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

PrimaryButton.displayName = 'PrimaryButton';

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 28, // Pill shape (half of height)
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  icon: {
    fontSize: 20,
  },
  shadowIOS: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  shadowAndroid: {
    elevation: 3,
  },
});
