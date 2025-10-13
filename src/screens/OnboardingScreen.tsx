/**
 * @fileoverview Onboarding Screen - First-time user introduction
 * @purpose Introduces new users to WayTrove features and value proposition
 * @inputs Navigation props for moving to authentication or main app
 * @outputs Interactive onboarding flow with feature highlights
 *
 * TODO: Add onboarding slides with app features and screenshots
 * TODO: Implement swipe gestures for slide navigation
 * TODO: Add skip functionality with analytics tracking
 * TODO: Include privacy policy and terms of service links
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useThemeColors } from '../contexts';
import { useAuth } from '../contexts/auth/AuthContext';

export default function OnboardingScreen() {
  const colors = useThemeColors();
  const { markOnboardingComplete } = useAuth();

  const handleGetStarted = async () => {
    try {
      await markOnboardingComplete();
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.primary }]}>
            Welcome to WayTrove
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Discover amazing travel destinations and plan your next adventure
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <View
            style={[
              styles.featureCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>
              🗺️ Discover Routes
            </Text>
            <Text
              style={[
                styles.featureDescription,
                { color: colors.textSecondary },
              ]}
            >
              Find curated travel routes and hidden gems from fellow travelers
            </Text>
          </View>

          <View
            style={[
              styles.featureCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>
              🛡️ Stay Safe
            </Text>
            <Text
              style={[
                styles.featureDescription,
                { color: colors.textSecondary },
              ]}
            >
              Get real-time safety alerts and travel advisories for your
              destinations
            </Text>
          </View>

          <View
            style={[
              styles.featureCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>
              📱 Plan & Share
            </Text>
            <Text
              style={[
                styles.featureDescription,
                { color: colors.textSecondary },
              ]}
            >
              Create itineraries, bookmark favorites, and share your experiences
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.getStartedButton, { backgroundColor: colors.primary }]}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text style={[styles.getStartedText, { color: colors.textInverse }]}>
            Get Started
          </Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={[styles.footerText, { color: colors.textTertiary }]}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
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
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  features: {
    flex: 1,
    justifyContent: 'center',
    gap: 24,
  },
  featureCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  getStartedButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 24,
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});
