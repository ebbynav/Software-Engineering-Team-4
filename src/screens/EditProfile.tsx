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
import { useAuth } from '../contexts/auth/AuthContext';
import CountryPicker, { Country } from 'react-native-country-picker-modal';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export default function EditProfile() {
  const colors = useThemeColors();
  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();

  // Local editable state initialized from mock user
  const [name, setName] = useState(MOCK_USER.name);
  const [email, setEmail] = useState(MOCK_USER.email);
  const [city, setCity] = useState(MOCK_USER.city);
  const [bio, setBio] = useState(MOCK_USER.bio || '');
  const { user, updateProfile } = useAuth();

  const [primaryContact, setPrimaryContact] = useState(user?.primaryContact ?? '');
  const [secondaryContact, setSecondaryContact] = useState(user?.secondaryContact ?? '');

  // Track country selection and national number separately for better UX
  const [primaryCountry, setPrimaryCountry] = useState<Country | null>(null);
  const [secondaryCountry, setSecondaryCountry] = useState<Country | null>(null);
  const [primaryNational, setPrimaryNational] = useState('');
  const [secondaryNational, setSecondaryNational] = useState('');

  // If user has numbers in E.164 when opening, try to parse them to prefill country + national
  React.useEffect(() => {
    if (user?.primaryContact) {
      const p = parsePhoneNumberFromString(user.primaryContact);
      if (p) {
        // minimal cast to Country to prefill picker
        setPrimaryCountry({
          cca2: (p.country || 'US') as any,
          callingCode: [String(p.countryCallingCode || '')],
          name: '',
          cca3: '',
        } as unknown as Country);
        setPrimaryNational(p.nationalNumber || '');
        setPrimaryContact(user.primaryContact);
      }
    }
    if (user?.secondaryContact) {
      const s = parsePhoneNumberFromString(user.secondaryContact);
      if (s) {
        setSecondaryCountry({
          cca2: (s.country || 'US') as any,
          callingCode: [String(s.countryCallingCode || '')],
          name: '',
          cca3: '',
        } as unknown as Country);
        setSecondaryNational(s.nationalNumber || '');
        setSecondaryContact(user.secondaryContact);
      }
    }
  }, [user]);
  const [unitsMetric, setUnitsMetric] = useState(MOCK_USER.preferences.units === 'metric');
  const [safetyAlerts, setSafetyAlerts] = useState(
    MOCK_USER.preferences.notifications.safetyAlerts
  );

  const handleSave = () => {
    // Mock save - in a real app this would call an API or context update
    // Validate and normalize phone numbers to E.164 using libphonenumber-js
    try {
      const updates: Partial<typeof user> = {};

      if (primaryNational || primaryContact) {
        // If user typed an E.164 already use it, otherwise try to build from country + national
        let pNumber = primaryContact || '';
        if (!pNumber && primaryCountry && primaryNational) {
          const code = primaryCountry.callingCode?.[0] ?? '';
          pNumber = `+${code}${primaryNational}`;
        }

        const parsed = parsePhoneNumberFromString(pNumber || '');
        if (parsed && parsed.isValid()) {
          updates.primaryContact = parsed.number; // E.164
        } else if (pNumber) {
          throw new Error('Primary contact is not a valid phone number');
        }
      }

      if (secondaryNational || secondaryContact) {
        let sNumber = secondaryContact || '';
        if (!sNumber && secondaryCountry && secondaryNational) {
          const code = secondaryCountry.callingCode?.[0] ?? '';
          sNumber = `+${code}${secondaryNational}`;
        }

        const parsedS = parsePhoneNumberFromString(sNumber || '');
        if (parsedS && parsedS.isValid()) {
          updates.secondaryContact = parsedS.number;
        } else if (sNumber) {
          throw new Error('Secondary contact is not a valid phone number');
        }
      }

      updateProfile(updates)
        .then(() => {
          Alert.alert('Save Profile', 'Profile saved (mock).', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        })
        .catch(err => {
          Alert.alert('Save Failed', String(err));
        });
    } catch (err) {
      Alert.alert('Validation Error', String(err));
    }
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
          // Reset contact fields to current user values (if any)
          setPrimaryContact(user?.primaryContact ?? '');
          setSecondaryContact(user?.secondaryContact ?? '');
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

          <Text style={[styles.label, { color: colors.textSecondary }]}>Primary Contact</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <CountryPicker
              countryCode={primaryCountry?.cca2 as any}
              withCallingCode
              withFilter
              withFlag
              onSelect={(c: Country) => {
                setPrimaryCountry(c);
              }}
            />
            <TextInput
              style={[
                styles.input,
                { color: colors.textPrimary, borderColor: colors.border, flex: 1 },
              ]}
              value={primaryNational}
              onChangeText={setPrimaryNational}
              placeholder="Enter phone number"
              placeholderTextColor={colors.textTertiary}
              keyboardType="phone-pad"
            />
          </View>
          <Text style={[styles.small, { color: colors.textSecondary, marginTop: 6 }]}>
            Or paste full number (E.164) in the field below
          </Text>
          <TextInput
            style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
            value={primaryContact}
            onChangeText={setPrimaryContact}
            placeholder="+15551234567"
            placeholderTextColor={colors.textTertiary}
            keyboardType="phone-pad"
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>Secondary Contact</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <CountryPicker
              countryCode={secondaryCountry?.cca2 as any}
              withCallingCode
              withFilter
              withFlag
              onSelect={(c: Country) => {
                setSecondaryCountry(c);
              }}
            />
            <TextInput
              style={[
                styles.input,
                { color: colors.textPrimary, borderColor: colors.border, flex: 1 },
              ]}
              value={secondaryNational}
              onChangeText={setSecondaryNational}
              placeholder="Enter phone number"
              placeholderTextColor={colors.textTertiary}
              keyboardType="phone-pad"
            />
          </View>
          <Text style={[styles.small, { color: colors.textSecondary, marginTop: 6 }]}>
            Or paste full number (E.164) in the field below
          </Text>
          <TextInput
            style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
            value={secondaryContact}
            onChangeText={setSecondaryContact}
            placeholder="+15559876543"
            placeholderTextColor={colors.textTertiary}
            keyboardType="phone-pad"
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
