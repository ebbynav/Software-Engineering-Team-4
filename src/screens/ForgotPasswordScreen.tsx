/**
 * ForgotPasswordScreen
 *
 * Password reset screen with email input.
 *
 * VISUAL SPECIFICATIONS:
 * - Title: 28px bold, "Reset Password"
 * - Description text below title
 * - Email input with @ icon
 * - Primary button: "Send Reset Link"
 * - Success message: green banner
 *
 * BEHAVIOR:
 * - Validate email format
 * - Show mock success toast after submission
 * - Navigate back to Login after success
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useThemeColors } from '../contexts/theme/ThemeContext';
import { RootStackParamList } from '../types';
import { ThemedTextInput, PrimaryButton } from '../components';

type ForgotPasswordNavigationProp = StackNavigationProp<RootStackParamList, 'ForgotPassword'>;

const validateEmail = (email: string): string | undefined => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Invalid email format';
  return undefined;
};

export default function ForgotPasswordScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation<ForgotPasswordNavigationProp>();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }

    setLoading(true);

    // Mock API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      Alert.alert(
        'Reset Link Sent',
        `We've sent a password reset link to ${email}. Please check your inbox.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Reset Password</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Enter your email address and we'll send you a link to reset your password.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <ThemedTextInput
            label="Email"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChangeText={text => {
              setEmail(text);
              if (emailError) setEmailError(undefined);
              if (success) setSuccess(false);
            }}
            error={emailError}
            leftIcon={<Text style={{ fontSize: 20 }}>📧</Text>}
          />

          <PrimaryButton
            label="Send Reset Link"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading || success}
          />
        </View>

        {success && (
          <View
            style={[
              styles.successBanner,
              {
                backgroundColor: `${colors.success}20`,
                borderColor: colors.success,
              },
            ]}
          >
            <Text style={[styles.successText, { color: colors.success }]}>
              ✓ Reset link sent! Check your email.
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  form: {
    marginBottom: 24,
  },
  successBanner: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 16,
  },
  successText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
