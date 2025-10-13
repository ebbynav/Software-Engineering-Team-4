import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../contexts/theme/ThemeContext';
import { useAuth } from '../contexts/auth/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { Avatar } from '../components/Avatar';
import { MOCK_USER } from '../data/mockData';

export default function ProfileScreen() {
  const colors = useThemeColors();
  const { signOut } = useAuth();
  const [safetyAlerts, setSafetyAlerts] = useState(
    MOCK_USER.preferences.notifications.safetyAlerts
  );
  const [routeUpdates, setRouteUpdates] = useState(
    MOCK_USER.preferences.notifications.routeUpdates
  );
  const [socialActivity, setSocialActivity] = useState(
    MOCK_USER.preferences.notifications.socialActivity
  );

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: signOut,
      },
    ]);
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing will be available soon!');
  };

  const handleSettingPress = (setting: string) => {
    Alert.alert(setting, `${setting} settings coming soon!`);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Profile
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Manage your account
          </Text>
        </View>
        <ThemeToggle />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <View style={styles.profileHeader}>
            <Avatar
              src={MOCK_USER.avatar}
              initials={MOCK_USER.name
                .split(' ')
                .map(n => n[0])
                .join('')}
              size={80}
            />
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: colors.primary }]}
              onPress={handleEditProfile}
            >
              <Text style={styles.editButtonText}>✏️</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.profileName, { color: colors.textPrimary }]}>
            {MOCK_USER.name}
          </Text>
          <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
            {MOCK_USER.email}
          </Text>
          <Text
            style={[styles.profileLocation, { color: colors.textSecondary }]}
          >
            📍 {MOCK_USER.city}
          </Text>

          {MOCK_USER.bio && (
            <Text style={[styles.profileBio, { color: colors.textSecondary }]}>
              {MOCK_USER.bio}
            </Text>
          )}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {MOCK_USER.stats.routesCreated}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Routes Created
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statNumber, { color: colors.success }]}>
              {MOCK_USER.stats.savedRoutes}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Saved Routes
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statNumber, { color: colors.accent }]}>
              {MOCK_USER.stats.followers}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Followers
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statNumber, { color: colors.info }]}>
              {MOCK_USER.stats.following}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Following
            </Text>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Account
          </Text>
          <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => handleSettingPress('Edit Profile')}
            >
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.settingIcon,
                    { backgroundColor: colors.primary + '20' },
                  ]}
                >
                  <Text style={styles.settingEmoji}>👤</Text>
                </View>
                <Text
                  style={[styles.settingText, { color: colors.textPrimary }]}
                >
                  Edit Profile
                </Text>
              </View>
              <Text
                style={[styles.settingArrow, { color: colors.textTertiary }]}
              >
                ›
              </Text>
            </TouchableOpacity>

            <View
              style={[
                styles.settingDivider,
                { backgroundColor: colors.border },
              ]}
            />

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => handleSettingPress('Change Password')}
            >
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.settingIcon,
                    { backgroundColor: colors.warning + '20' },
                  ]}
                >
                  <Text style={styles.settingEmoji}>🔒</Text>
                </View>
                <Text
                  style={[styles.settingText, { color: colors.textPrimary }]}
                >
                  Change Password
                </Text>
              </View>
              <Text
                style={[styles.settingArrow, { color: colors.textTertiary }]}
              >
                ›
              </Text>
            </TouchableOpacity>

            <View
              style={[
                styles.settingDivider,
                { backgroundColor: colors.border },
              ]}
            />

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => handleSettingPress('Privacy Settings')}
            >
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.settingIcon,
                    { backgroundColor: colors.info + '20' },
                  ]}
                >
                  <Text style={styles.settingEmoji}>🛡️</Text>
                </View>
                <Text
                  style={[styles.settingText, { color: colors.textPrimary }]}
                >
                  Privacy Settings
                </Text>
              </View>
              <Text
                style={[styles.settingArrow, { color: colors.textTertiary }]}
              >
                ›
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Notifications
          </Text>
          <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.settingIcon,
                    { backgroundColor: colors.error + '20' },
                  ]}
                >
                  <Text style={styles.settingEmoji}>🚨</Text>
                </View>
                <View style={styles.settingTextContainer}>
                  <Text
                    style={[styles.settingText, { color: colors.textPrimary }]}
                  >
                    Safety Alerts
                  </Text>
                  <Text
                    style={[
                      styles.settingSubtext,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Get notified about safety issues
                  </Text>
                </View>
              </View>
              <Switch
                value={safetyAlerts}
                onValueChange={setSafetyAlerts}
                trackColor={{
                  false: colors.border,
                  true: colors.primary + '80',
                }}
                thumbColor={safetyAlerts ? colors.primary : colors.textTertiary}
              />
            </View>

            <View
              style={[
                styles.settingDivider,
                { backgroundColor: colors.border },
              ]}
            />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.settingIcon,
                    { backgroundColor: colors.accent + '20' },
                  ]}
                >
                  <Text style={styles.settingEmoji}>🗺️</Text>
                </View>
                <View style={styles.settingTextContainer}>
                  <Text
                    style={[styles.settingText, { color: colors.textPrimary }]}
                  >
                    Route Updates
                  </Text>
                  <Text
                    style={[
                      styles.settingSubtext,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Updates on saved routes
                  </Text>
                </View>
              </View>
              <Switch
                value={routeUpdates}
                onValueChange={setRouteUpdates}
                trackColor={{
                  false: colors.border,
                  true: colors.primary + '80',
                }}
                thumbColor={routeUpdates ? colors.primary : colors.textTertiary}
              />
            </View>

            <View
              style={[
                styles.settingDivider,
                { backgroundColor: colors.border },
              ]}
            />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.settingIcon,
                    { backgroundColor: colors.success + '20' },
                  ]}
                >
                  <Text style={styles.settingEmoji}>👥</Text>
                </View>
                <View style={styles.settingTextContainer}>
                  <Text
                    style={[styles.settingText, { color: colors.textPrimary }]}
                  >
                    Social Activity
                  </Text>
                  <Text
                    style={[
                      styles.settingSubtext,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Followers and mentions
                  </Text>
                </View>
              </View>
              <Switch
                value={socialActivity}
                onValueChange={setSocialActivity}
                trackColor={{
                  false: colors.border,
                  true: colors.primary + '80',
                }}
                thumbColor={
                  socialActivity ? colors.primary : colors.textTertiary
                }
              />
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Preferences
          </Text>
          <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => handleSettingPress('Language')}
            >
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.settingIcon,
                    { backgroundColor: colors.primary + '20' },
                  ]}
                >
                  <Text style={styles.settingEmoji}>🌐</Text>
                </View>
                <Text
                  style={[styles.settingText, { color: colors.textPrimary }]}
                >
                  Language
                </Text>
              </View>
              <View style={styles.settingRight}>
                <Text
                  style={[styles.settingValue, { color: colors.textSecondary }]}
                >
                  English
                </Text>
                <Text
                  style={[styles.settingArrow, { color: colors.textTertiary }]}
                >
                  ›
                </Text>
              </View>
            </TouchableOpacity>

            <View
              style={[
                styles.settingDivider,
                { backgroundColor: colors.border },
              ]}
            />

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => handleSettingPress('Units')}
            >
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.settingIcon,
                    { backgroundColor: colors.accent + '20' },
                  ]}
                >
                  <Text style={styles.settingEmoji}>📏</Text>
                </View>
                <Text
                  style={[styles.settingText, { color: colors.textPrimary }]}
                >
                  Units
                </Text>
              </View>
              <View style={styles.settingRight}>
                <Text
                  style={[styles.settingValue, { color: colors.textSecondary }]}
                >
                  {MOCK_USER.preferences.units === 'metric'
                    ? 'Metric'
                    : 'Imperial'}
                </Text>
                <Text
                  style={[styles.settingArrow, { color: colors.textTertiary }]}
                >
                  ›
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* More Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            More
          </Text>
          <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => handleSettingPress('Help & Support')}
            >
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.settingIcon,
                    { backgroundColor: colors.info + '20' },
                  ]}
                >
                  <Text style={styles.settingEmoji}>❓</Text>
                </View>
                <Text
                  style={[styles.settingText, { color: colors.textPrimary }]}
                >
                  Help & Support
                </Text>
              </View>
              <Text
                style={[styles.settingArrow, { color: colors.textTertiary }]}
              >
                ›
              </Text>
            </TouchableOpacity>

            <View
              style={[
                styles.settingDivider,
                { backgroundColor: colors.border },
              ]}
            />

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => handleSettingPress('About')}
            >
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.settingIcon,
                    { backgroundColor: colors.success + '20' },
                  ]}
                >
                  <Text style={styles.settingEmoji}>ℹ️</Text>
                </View>
                <Text
                  style={[styles.settingText, { color: colors.textPrimary }]}
                >
                  About WayTrove
                </Text>
              </View>
              <Text
                style={[styles.settingArrow, { color: colors.textTertiary }]}
              >
                ›
              </Text>
            </TouchableOpacity>

            <View
              style={[
                styles.settingDivider,
                { backgroundColor: colors.border },
              ]}
            />

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => handleSettingPress('Terms & Privacy')}
            >
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.settingIcon,
                    { backgroundColor: colors.textSecondary + '20' },
                  ]}
                >
                  <Text style={styles.settingEmoji}>📄</Text>
                </View>
                <Text
                  style={[styles.settingText, { color: colors.textPrimary }]}
                >
                  Terms & Privacy
                </Text>
              </View>
              <Text
                style={[styles.settingArrow, { color: colors.textTertiary }]}
              >
                ›
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={[
            styles.signOutButton,
            { backgroundColor: colors.error + '15' },
          ]}
          onPress={handleSignOut}
        >
          <Text style={[styles.signOutText, { color: colors.error }]}>
            Sign Out
          </Text>
        </TouchableOpacity>

        {/* Version Info */}
        <Text style={[styles.versionText, { color: colors.textTertiary }]}>
          WayTrove v1.0.0
        </Text>

        {/* Bottom spacing */}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  profileCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileHeader: {
    position: 'relative',
    marginBottom: 16,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  editButtonText: {
    fontSize: 14,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 4,
  },
  profileLocation: {
    fontSize: 14,
    marginBottom: 12,
  },
  profileBio: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    margin: '1%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  settingsCard: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingEmoji: {
    fontSize: 20,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    marginRight: 4,
  },
  settingArrow: {
    fontSize: 24,
    marginLeft: 4,
  },
  settingDivider: {
    height: 1,
    marginLeft: 68,
  },
  signOutButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
});
