import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../contexts/theme/ThemeContext';
import { MOCK_USER } from '../data/mockData';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { ProfileStackParamList } from '../navigation/types';

export default function EditProfile() {
  const colors = useThemeColors();
  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();

  // Local editable state initialized from mock user
  const [name, setName] = useState(MOCK_USER.name);
  const [email, setEmail] = useState(MOCK_USER.email);
  const [city, setCity] = useState(MOCK_USER.city);
  const [bio, setBio] = useState(MOCK_USER.bio || '');
  const [unitsMetric, setUnitsMetric] = useState(MOCK_USER.preferences.units === 'metric');
  const [safetyAlerts, setSafetyAlerts] = useState(
    MOCK_USER.preferences.notifications.safetyAlerts
  );

  const handleSave = () => {
    // Mock save - in a real app this would call an API or context update
    Alert.alert('Save Profile', 'Profile saved (mock).', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const handleCancel = () => {
    Alert.alert('Cancel', 'Discard changes?', [
      { text: 'Keep Editing', style: 'cancel' },
      {
        text: 'Discard',
        style: 'destructive',
        onPress: () => {
          // Reset fields to initial mock values
          setName(MOCK_USER.name);
          setEmail(MOCK_USER.email);
          setCity(MOCK_USER.city);
          setBio(MOCK_USER.bio || '');
          setUnitsMetric(MOCK_USER.preferences.units === 'metric');
          setSafetyAlerts(MOCK_USER.preferences.notifications.safetyAlerts);
          // Navigate back to the Profile screen after discarding
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Edit Profile</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
              <Text style={[styles.headerButtonText, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={[
                styles.headerButton,
                {
                  marginLeft: 12,
                  backgroundColor: colors.primary,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 8,
                },
              ]}
            >
              <Text style={[styles.headerButtonText, { color: '#fff' }]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.formCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Full name</Text>
          <TextInput
            style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={colors.textTertiary}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
          <TextInput
            style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="you@example.com"
            placeholderTextColor={colors.textTertiary}
            autoCapitalize="none"
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>City</Text>
          <TextInput
            style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
            value={city}
            onChangeText={setCity}
            placeholder="City"
            placeholderTextColor={colors.textTertiary}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>Bio</Text>
          <TextInput
            style={[styles.textarea, { color: colors.textPrimary, borderColor: colors.border }]}
            value={bio}
            onChangeText={setBio}
            placeholder="A short bio"
            placeholderTextColor={colors.textTertiary}
            multiline
            numberOfLines={4}
          />

          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>Units (Metric)</Text>
            <Switch
              value={unitsMetric}
              onValueChange={setUnitsMetric}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={unitsMetric ? colors.primary : colors.textTertiary}
            />
          </View>

          <View style={[styles.rowBetween, { marginTop: 8 }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Safety Alerts</Text>
              <Text style={[styles.small, { color: colors.textSecondary }]}>
                Receive notifications about nearby safety issues
              </Text>
            </View>
            <Switch
              value={safetyAlerts}
              onValueChange={setSafetyAlerts}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={safetyAlerts ? colors.primary : colors.textTertiary}
            />
          </View>
        </View>

        <View style={styles.recommendationsCard}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Suggestions</Text>
          <Text style={[styles.recommendationItem, { color: colors.textSecondary }]}>
            • Use a clear, friendly profile photo — faces are more likely to be recognized.
          </Text>
          <Text style={[styles.recommendationItem, { color: colors.textSecondary }]}>
            • Keep your bio short (1–2 lines) and highlight what you share on the app.
          </Text>
          <Text style={[styles.recommendationItem, { color: colors.textSecondary }]}>
            • Avoid using your full street address in profile fields for privacy.
          </Text>
          <Text style={[styles.recommendationItem, { color: colors.textSecondary }]}>
            • Enable Safety Alerts to get timely updates about nearby incidents.
          </Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 24, fontWeight: '700' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  headerButton: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 6 },
  headerButtonText: { fontSize: 14 },
  formCard: { borderRadius: 12, padding: 16, marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 12 },
  textarea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  recommendationsCard: { padding: 12, borderRadius: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  recommendationItem: { fontSize: 14, marginBottom: 6 },
  small: { fontSize: 12 },
});
