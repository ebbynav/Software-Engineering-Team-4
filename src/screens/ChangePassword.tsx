import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../contexts/theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import { useAuth } from '../contexts/auth/AuthContext';

export default function ChangePassword() {
  const colors = useThemeColors();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { signOut } = useAuth();

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSave = () => {
    if (!current || !next || !confirm) {
      Alert.alert('Validation', 'All fields are required');
      return;
    }
    if (next !== confirm) {
      Alert.alert('Validation', 'New password and confirmation do not match');
      return;
    }

    // Mock password change: in a real app call API here
    Alert.alert('Password Changed', 'Your password has been changed. Please sign in again.', [
      {
        text: 'OK',
        onPress: () => {
          // Sign out and send user to Login
          signOut();
          // Ensure we land on the Login screen in the root stack
          navigation.reset({ index: 0, routes: [{ name: 'Login' as const }] });
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Change Password</Text>

        <Text style={[styles.label, { color: colors.textSecondary }]}>Current password</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
          value={current}
          onChangeText={setCurrent}
          secureTextEntry
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>New password</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
          value={next}
          onChangeText={setNext}
          secureTextEntry
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>Confirm new password</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Text style={[styles.saveText, { color: '#fff' }]}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  label: { fontSize: 14, marginTop: 12, marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10 },
  saveButton: { marginTop: 20, padding: 12, borderRadius: 8, alignItems: 'center' },
  saveText: { fontSize: 16, fontWeight: '600' },
});
