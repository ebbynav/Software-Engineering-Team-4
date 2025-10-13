/**
 * @fileoverview Profile Tab Screen - User profile, settings, and account management
 * @purpose User profile view with personal information and preferences
 * @inputs Optional userId from navigation params to view other profiles
 * @outputs User profile information and settings access
 *
 * TODO: Implement profile editing functionality
 * TODO: Add user statistics (routes completed, places visited, contributions)
 * TODO: Connect to Django API endpoint: /profile/:userId, /profile/stats
 * TODO: Implement profile photo upload
 * TODO: Add social features (followers, following)
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../contexts';
import { useAuth } from '../contexts/auth/AuthContext';
import type { ProfileStackParamList } from '../navigation/types';
import type { StackScreenProps } from '@react-navigation/stack';

type Props = StackScreenProps<ProfileStackParamList, 'Profile'>;

export default function ProfileScreen({ route }: Props) {
  const colors = useThemeColors();
  const { user, signOut } = useAuth();
  const { userId } = route.params || {};

  // Viewing own profile if no userId provided
  const isOwnProfile = !userId || userId === user?.id;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <View
            style={[styles.avatar, { backgroundColor: colors.primary + '30' }]}
          >
            <Text style={styles.avatarText}>
              {user?.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.name, { color: colors.textPrimary }]}>
            {user?.name || 'Guest User'}
          </Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>
            {user?.email || 'guest@waytrove.com'}
          </Text>
          {user?.city && (
            <Text style={[styles.location, { color: colors.textSecondary }]}>
              📍 {user.city}
            </Text>
          )}
        </View>

        {/* User Stats */}
        <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              24
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Routes
            </Text>
          </View>
          <View
            style={[styles.statDivider, { backgroundColor: colors.border }]}
          />
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              156
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Places
            </Text>
          </View>
          <View
            style={[styles.statDivider, { backgroundColor: colors.border }]}
          />
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              42
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Reviews
            </Text>
          </View>
        </View>

        {/* Interests */}
        {user?.interests && user.interests.length > 0 && (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
              ⭐ Interests
            </Text>
            <View style={styles.interestsList}>
              {user.interests.map((interest, index) => (
                <View
                  key={index}
                  style={[
                    styles.interestBadge,
                    { backgroundColor: colors.primary + '20' },
                  ]}
                >
                  <Text
                    style={[styles.interestText, { color: colors.primary }]}
                  >
                    {interest}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Quick Actions */}
        {isOwnProfile && (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
              ⚙️ Quick Actions
            </Text>
            <TouchableOpacity style={styles.actionItem}>
              <Text style={[styles.actionText, { color: colors.textPrimary }]}>
                Edit Profile
              </Text>
              <Text
                style={[styles.actionIcon, { color: colors.textSecondary }]}
              >
                ›
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <Text style={[styles.actionText, { color: colors.textPrimary }]}>
                My Routes
              </Text>
              <Text
                style={[styles.actionIcon, { color: colors.textSecondary }]}
              >
                ›
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <Text style={[styles.actionText, { color: colors.textPrimary }]}>
                Preferences
              </Text>
              <Text
                style={[styles.actionIcon, { color: colors.textSecondary }]}
              >
                ›
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <Text style={[styles.actionText, { color: colors.textPrimary }]}>
                About WayTrove
              </Text>
              <Text
                style={[styles.actionIcon, { color: colors.textSecondary }]}
              >
                ›
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Sign Out */}
        {isOwnProfile && (
          <TouchableOpacity
            style={[
              styles.signOutButton,
              { backgroundColor: colors.error + '15' },
            ]}
            onPress={signOut}
          >
            <Text style={[styles.signOutText, { color: colors.error }]}>
              Sign Out
            </Text>
          </TouchableOpacity>
        )}

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            🔗 API Integration
          </Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
            TODO: Connect to Django endpoints:{'\n'}• GET /profile/:userId{'\n'}
            • PUT /profile/edit{'\n'}• GET /profile/stats{'\n'}• POST
            /profile/photo
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
  },
  statsCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: '100%',
  },
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
  },
  interestsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  interestText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  actionText: {
    fontSize: 16,
  },
  actionIcon: {
    fontSize: 24,
  },
  signOutButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
