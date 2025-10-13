/**
 * @fileoverview Login Screen - User authentication interface
 * @purpose Provides sign-in options including social logins and email authentication
 * @inputs User credentials and authentication method selection
 * @outputs User authentication and navigation to main app
 *
 * TODO: Integrate expo-auth-session for Google OAuth2 flow
 * TODO: Integrate expo-apple-authentication for Apple Sign-In
 * TODO: Add form validation with proper error handling
 * TODO: Implement "Remember Me" functionality
 * TODO: Add "Forgot Password" flow with email reset
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useThemeColors } from '../contexts';
import { useAuth, SignInMethod } from '../contexts/auth/AuthContext';

export default function LoginScreen() {
  const colors = useThemeColors();
  const { signInMock, isAuthenticating } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailSignIn = async () => {
    try {
      await signInMock('email', { email, password });
    } catch (error) {
      Alert.alert(
        'Sign In Failed',
        'Please check your credentials and try again.'
      );
    }
  };

  const handleSocialSignIn = async (method: SignInMethod) => {
    try {
      // TODO: Integrate actual social authentication
      // For Google: Use expo-auth-session with Google OAuth2
      // For Apple: Use expo-apple-authentication

      await signInMock(method, {});
    } catch (error) {
      Alert.alert(
        'Sign In Failed',
        `Failed to sign in with ${method}. Please try again.`
      );
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Sign in to continue your travel journey
          </Text>
        </View>

        {/* Social Sign In */}
        <View style={styles.socialButtons}>
          <TouchableOpacity
            style={[
              styles.socialButton,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={() => handleSocialSignIn('google')}
            disabled={isAuthenticating}
          >
            <Text
              style={[styles.socialButtonText, { color: colors.textPrimary }]}
            >
              🔍 Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.socialButton,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={() => handleSocialSignIn('apple')}
            disabled={isAuthenticating}
          >
            <Text
              style={[styles.socialButtonText, { color: colors.textPrimary }]}
            >
              🍎 Continue with Apple
            </Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.textTertiary }]}>
            or
          </Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
        </View>

        {/* Email Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Email
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                },
              ]}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={colors.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isAuthenticating}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Password
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                },
              ]}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor={colors.muted}
              secureTextEntry
              editable={!isAuthenticating}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.signInButton,
              {
                backgroundColor: colors.primary,
                opacity: isAuthenticating ? 0.7 : 1,
              },
            ]}
            onPress={handleEmailSignIn}
            disabled={isAuthenticating || !email || !password}
          >
            <Text
              style={[styles.signInButtonText, { color: colors.textInverse }]}
            >
              {isAuthenticating ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity>
            <Text style={[styles.forgotPassword, { color: colors.primary }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <Text style={[styles.signUpPrompt, { color: colors.textSecondary }]}>
            Don't have an account?{' '}
            <Text style={[styles.signUpLink, { color: colors.primary }]}>
              Sign Up
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  socialButtons: {
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  signInButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    gap: 16,
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: '500',
  },
  signUpPrompt: {
    fontSize: 14,
  },
  signUpLink: {
    fontWeight: '600',
  },
});
