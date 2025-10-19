import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedTextInput, PrimaryButton } from '../components';
import { useThemeColors } from '../contexts/theme/ThemeContext';
import { useAuth } from '../contexts/auth/AuthContext';
import * as authService from '../services/authService';

export default function SignUpScreen() {
  const colors = useThemeColors();
  const { signUpMock } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = (): string | null => {
    if (!name.trim()) return 'Name is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Enter a valid email';
    if (password.length < 8) return 'Password must be at least 8 characters';
    return null;
  };

  const handleSignUp = async () => {
    const err = validate();
    if (err) return Alert.alert('Validation error', err);

    setLoading(true);
    try {
      // Prefer real backend register when implemented, fall back to mock
      if (authService.register && typeof authService.register === 'function') {
        await authService.register(email, password, '', name);
        // The authService.register should return tokens/user; for now we show a success
        Alert.alert('Success', 'Account created. Please check your email to verify (if required).');
      } else {
        await signUpMock({ name, email, password });
      }
    } catch (error) {
      console.error('Sign up failed', error);
      Alert.alert('Sign Up Failed', (error as Error).message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Join WayTrove to save routes and keep your safety contacts handy.
            </Text>
          </View>

          <View style={styles.form}>
            <ThemedTextInput
              label="Full name"
              value={name}
              onChangeText={setName}
              placeholder="Jane Doe"
            />
            <ThemedTextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@domain.com"
              type="email"
            />
            <ThemedTextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              secureTextEntry
            />

            <PrimaryButton
              label="Create account"
              onPress={handleSignUp}
              loading={loading}
              disabled={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 72, paddingBottom: 40 },
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#666', lineHeight: 22 },
  form: { marginTop: 12 },
});
