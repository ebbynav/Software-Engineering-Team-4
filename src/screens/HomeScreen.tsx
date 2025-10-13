/**
 * @fileoverview Home Screen - Main dashboard for authenticated users
 * @purpose Displays travel recommendations, user content, and navigation options
 * @inputs User preferences, location data, travel history
 * @outputs Personalized travel content and navigation to other features
 *
 * TODO: Implement destination recommendations based on user interests
 * TODO: Add location-based suggestions using device GPS
 * TODO: Integrate with Django backend for personalized content
 * TODO: Add pull-to-refresh functionality for fresh content
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useThemeColors } from '../contexts';
import { useAuth } from '../contexts/auth/AuthContext';
import { ThemeToggle } from '../components';

export default function HomeScreen() {
  const colors = useThemeColors();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              Welcome back,
            </Text>
            <Text style={[styles.userName, { color: colors.textPrimary }]}>
              {user?.name || 'Traveler'}
            </Text>
          </View>

          <View style={styles.headerActions}>
            <ThemeToggle size={20} />
          </View>
        </View>

        {/* User Info Card */}
        <View
          style={[
            styles.userCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.userInfo}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={[styles.avatarText, { color: colors.textInverse }]}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text
                style={[styles.userNameCard, { color: colors.textPrimary }]}
              >
                {user?.name}
              </Text>
              <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
                {user?.email}
              </Text>
              {user?.city && (
                <Text style={[styles.userCity, { color: colors.textTertiary }]}>
                  📍 {user.city}
                </Text>
              )}
            </View>
          </View>

          {user?.interests && user.interests.length > 0 && (
            <View style={styles.interests}>
              <Text
                style={[styles.interestsLabel, { color: colors.textSecondary }]}
              >
                Interests:
              </Text>
              <View style={styles.interestTags}>
                {user.interests.map((interest, index) => (
                  <View
                    key={index}
                    style={[
                      styles.interestTag,
                      { backgroundColor: colors.primaryLight },
                    ]}
                  >
                    <Text
                      style={[
                        styles.interestText,
                        { color: colors.textInverse },
                      ]}
                    >
                      {interest}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Quick Actions
          </Text>

          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={[
                styles.actionCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text style={styles.actionIcon}>🗺️</Text>
              <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>
                Discover Routes
              </Text>
              <Text
                style={[
                  styles.actionDescription,
                  { color: colors.textSecondary },
                ]}
              >
                Find new destinations
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text style={styles.actionIcon}>🔖</Text>
              <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>
                Bookmarks
              </Text>
              <Text
                style={[
                  styles.actionDescription,
                  { color: colors.textSecondary },
                ]}
              >
                Saved destinations
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text style={styles.actionIcon}>🛡️</Text>
              <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>
                Safety Alerts
              </Text>
              <Text
                style={[
                  styles.actionDescription,
                  { color: colors.textSecondary },
                ]}
              >
                Stay informed
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text style={styles.actionIcon}>📱</Text>
              <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>
                Plan Trip
              </Text>
              <Text
                style={[
                  styles.actionDescription,
                  { color: colors.textSecondary },
                ]}
              >
                Create itinerary
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Placeholder Content */}
        <View style={styles.placeholderContent}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Recommended for You
          </Text>

          <View
            style={[
              styles.placeholderCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text
              style={[styles.placeholderText, { color: colors.textSecondary }]}
            >
              🚧 Travel recommendations will appear here once connected to the
              Django backend
            </Text>
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={[styles.signOutButton, { backgroundColor: colors.error }]}
          onPress={handleSignOut}
        >
          <Text style={[styles.signOutText, { color: colors.textInverse }]}>
            Sign Out
          </Text>
        </TouchableOpacity>
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
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  greeting: {
    fontSize: 14,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userNameCard: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  userCity: {
    fontSize: 12,
  },
  interests: {
    marginTop: 8,
  },
  interestsLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
  },
  interestTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  interestTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  interestText: {
    fontSize: 11,
    fontWeight: '500',
  },
  quickActions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  placeholderContent: {
    marginBottom: 24,
  },
  placeholderCard: {
    padding: 24,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  signOutButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
    marginHorizontal: 8,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
