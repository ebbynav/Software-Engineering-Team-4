/**
 * @fileoverview IconButton - Circular icon button with ghost/filled variants
 * @purpose Provides compact icon-only buttons for actions like close, back, favorite
 *
 * COMPONENT CONTRACT:
 *
 * Props:
 * - onPress: () => void - Handler called when button is pressed
 * - iconName: string - Icon to display (emoji or icon name)
 * - size?: number - Button diameter in pixels (default: 44)
 * - variant?: 'ghost' | 'filled' - Visual style (default: 'ghost')
 * - accessibilityLabel: string - Required label for screen readers
 * - disabled?: boolean - Disables interaction
 * - style?: ViewStyle - Additional custom styles
 * - testID?: string - Testing identifier
 *
 * Visual Specifications:
 * - Shape: Perfect circle
 * - Minimum Size: 44x44 (WCAG touch target)
 * - Ghost variant: Transparent background, visible on press
 * - Filled variant: theme.colors.card background, shadow elevation
 * - Icon: Centered, scales with size (size * 0.45)
 * - Active state: 0.7 opacity on press
 *
 * Behavior:
 * - Scale animation on press (0.95)
 * - Ghost variant shows background on press
 * - Filled variant has constant background with shadow
 * - Disabled state: 40% opacity, no interaction
 *
 * Accessibility:
 * - accessibilityRole="button"
 * - accessibilityLabel REQUIRED (no visual label)
 * - accessibilityHint optional for complex actions
 * - Minimum 44x44 touch target enforced
 *
 * EXAMPLE USAGE:
 * ```tsx
 * // Ghost variant (default)
 * <IconButton
 *   iconName="✕"
 *   onPress={handleClose}
 *   accessibilityLabel="Close"
 * />
 *
 * // Filled variant with custom size
 * <IconButton
 *   iconName="❤️"
 *   onPress={handleFavorite}
 *   variant="filled"
 *   size={48}
 *   accessibilityLabel="Add to favorites"
 * />
 *
 * // Disabled state
 * <IconButton
 *   iconName="→"
 *   onPress={handleNext}
 *   disabled={!canProceed}
 *   accessibilityLabel="Next"
 * />
 * ```
 *
 * TODO: Add support for icon libraries (@expo/vector-icons)
 * TODO: Add badge indicator for notifications
 * TODO: Add haptic feedback
 */

import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
  Platform,
} from 'react-native';
import { useThemeColors } from '../../contexts';

interface IconButtonProps {
  onPress: () => void;
  iconName: string;
  size?: number;
  variant?: 'ghost' | 'filled';
  accessibilityLabel: string;
  accessibilityHint?: string;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export const IconButton = React.memo<IconButtonProps>(
  ({
    onPress,
    iconName,
    size = 44,
    variant = 'ghost',
    accessibilityLabel,
    accessibilityHint,
    disabled = false,
    style,
    testID,
  }) => {
    const colors = useThemeColors();
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      if (!disabled) {
        Animated.spring(scaleAnim, {
          toValue: 0.95,
          useNativeDriver: true,
        }).start();
      }
    };

    const handlePressOut = () => {
      if (!disabled) {
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }).start();
      }
    };

    const handlePress = () => {
      if (!disabled) {
        onPress();
      }
    };

    const iconSize = size * 0.45;
    const isFilled = variant === 'filled';

    return (
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
        <TouchableOpacity
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          accessibilityState={{ disabled }}
          testID={testID}
          style={[
            styles.button,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: isFilled ? colors.card : 'transparent',
              opacity: disabled ? 0.4 : 1,
            },
            isFilled && Platform.OS === 'ios' && styles.shadowIOS,
            isFilled && Platform.OS === 'android' && styles.shadowAndroid,
          ]}
        >
          <Text
            style={[
              styles.icon,
              { fontSize: iconSize, color: colors.textPrimary },
            ]}
          >
            {iconName}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

IconButton.displayName = 'IconButton';

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    // Ensure minimum 44x44 touch target
    minWidth: 44,
    minHeight: 44,
  },
  icon: {
    textAlign: 'center',
  },
  shadowIOS: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  shadowAndroid: {
    elevation: 2,
  },
});
