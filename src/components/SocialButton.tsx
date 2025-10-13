/**
 * SocialButton Component
 *
 * A button for social authentication (Google, Apple, etc.)
 *
 * VISUAL SPECIFICATIONS:
 * - Height: 56px
 * - Border radius: 12px
 * - Google: White background with G icon, dark border
 * - Apple: Black background with Apple icon, no border
 * - Font size: 16px, weight 600
 * - Icon: 20×20px on left side
 *
 * BEHAVIOR:
 * - Scale animation on press (0.97)
 * - Loading state with spinner
 * - Disabled state (0.5 opacity)
 */

import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  View,
} from 'react-native';
import { useThemeColors, useIsDark } from '../contexts/theme/ThemeContext';

interface SocialButtonProps {
  /** Type of social provider */
  provider: 'google' | 'apple';
  /** Button label */
  label: string;
  /** Press handler */
  onPress: () => void;
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
}

export const SocialButton: React.FC<SocialButtonProps> = React.memo(
  ({ provider, label, onPress, loading = false, disabled = false }) => {
    const colors = useThemeColors();
    const isDark = useIsDark();
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 5,
      }).start();
    };

    const getButtonStyle = () => {
      if (provider === 'google') {
        return {
          backgroundColor: isDark ? colors.card : '#FFFFFF',
          borderColor: colors.border,
          borderWidth: 1,
        };
      }
      // Apple
      return {
        backgroundColor: '#000000',
        borderWidth: 0,
      };
    };

    const getTextColor = () => {
      if (provider === 'google') {
        return colors.textPrimary;
      }
      // Apple
      return '#FFFFFF';
    };

    const getIcon = () => {
      if (provider === 'google') {
        return '🔍'; // Placeholder for Google G icon
      }
      return ''; // Placeholder for Apple icon
    };

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={[
            styles.button,
            getButtonStyle(),
            (disabled || loading) && styles.disabled,
          ]}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityState={{ disabled: disabled || loading }}
        >
          {loading ? (
            <ActivityIndicator color={getTextColor()} size="small" />
          ) : (
            <View style={styles.content}>
              <Text style={[styles.icon, { color: getTextColor() }]}>
                {getIcon()}
              </Text>
              <Text style={[styles.label, { color: getTextColor() }]}>
                {label}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

SocialButton.displayName = 'SocialButton';

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
