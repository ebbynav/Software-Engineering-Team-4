/**
 * TextInput Component
 *
 * A themed text input with validation states, icons, and password visibility toggle.
 *
 * VISUAL SPECIFICATIONS:
 * - Height: 56px
 * - Border radius: 12px
 * - Border: 1px solid border color (error color on error)
 * - Padding: 16px horizontal
 * - Font size: 16px
 * - Placeholder: text secondary color
 * - Error message: 12px, red, 4px below input
 * - Focus: border color changes to primary
 *
 * BEHAVIOR:
 * - Password type shows eye icon toggle
 * - Error state changes border color
 * - Optional left icon
 * - Auto-capitalize email inputs as none
 *
 * ACCESSIBILITY:
 * - accessibilityLabel from label prop
 * - Error message announced to screen readers
 */

import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { useThemeColors } from '../contexts/theme/ThemeContext';

interface ThemedTextInputProps
  extends Omit<RNTextInputProps, 'placeholderTextColor'> {
  /** Label for accessibility */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Icon component to display on the left */
  leftIcon?: React.ReactNode;
  /** Input type (affects keyboard and validation) */
  type?: 'text' | 'email' | 'password';
}

export const ThemedTextInput: React.FC<ThemedTextInputProps> = React.memo(
  ({ label, error, leftIcon, type = 'text', value, ...props }) => {
    const colors = useThemeColors();
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const isPassword = type === 'password';
    const isEmail = type === 'email';

    const getBorderColor = () => {
      if (error) return '#EF4444';
      if (isFocused) return colors.primary;
      return colors.border;
    };

    return (
      <View style={styles.container}>
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.card,
              borderColor: getBorderColor(),
            },
          ]}
        >
          {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

          <RNTextInput
            style={[
              styles.input,
              { color: colors.textPrimary },
              leftIcon ? styles.inputWithLeftIcon : undefined,
              isPassword ? styles.inputWithRightIcon : undefined,
            ]}
            placeholderTextColor={colors.textSecondary}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            secureTextEntry={isPassword && !isPasswordVisible}
            autoCapitalize={isEmail ? 'none' : props.autoCapitalize}
            keyboardType={isEmail ? 'email-address' : props.keyboardType}
            autoCorrect={isEmail ? false : props.autoCorrect}
            value={value}
            accessibilityLabel={label || props.placeholder}
            {...props}
          />

          {isPassword && (
            <TouchableOpacity
              style={styles.rightIconContainer}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              accessibilityRole="button"
              accessibilityLabel={
                isPasswordVisible ? 'Hide password' : 'Show password'
              }
            >
              <Text style={[styles.eyeIcon, { color: colors.textSecondary }]}>
                {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {error && (
          <Text style={styles.errorText} accessibilityRole="alert">
            {error}
          </Text>
        )}
      </View>
    );
  }
);

ThemedTextInput.displayName = 'ThemedTextInput';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  leftIconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'System',
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  rightIconContainer: {
    marginLeft: 12,
    padding: 4,
  },
  eyeIcon: {
    fontSize: 20,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 4,
  },
});
