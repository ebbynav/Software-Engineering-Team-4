/**
 * @fileoverview Safety Tab Screen - Safety guides, alerts, and emergency resources
 * @purpose Centralized safety information and emergency contact access
 * @inputs None
 * @outputs Safety guides, alerts, and emergency contact information
 *
 * TODO: Implement real-time safety alerts from local authorities
 * TODO: Add emergency contact quick dial functionality
 * TODO: Connect to Django API endpoint: /safety/guides, /safety/alerts
 * TODO: Implement offline access to critical safety information
 * TODO: Add location-based safety recommendations
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../contexts';

export default function SafetyScreen() {
  const colors = useThemeColors();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Safety Hub
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Stay informed and stay safe
          </Text>
        </View>

        <View
          style={[
            styles.alertCard,
            { backgroundColor: colors.error + '15', borderColor: colors.error },
          ]}
        >
          <Text style={[styles.alertIcon]}>⚠️</Text>
          <View style={styles.alertContent}>
            <Text style={[styles.alertTitle, { color: colors.error }]}>
              Safety Alerts
            </Text>
            <Text style={[styles.alertText, { color: colors.textPrimary }]}>
              Real-time alerts from local authorities
            </Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            🚨 Emergency Services
          </Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
            Quick access to emergency contacts based on your location:{'\n'}•
            Police{'\n'}• Ambulance{'\n'}• Fire Department{'\n'}• Tourist Police
            {'\n'}• Embassy Contacts
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            📖 Safety Guides
          </Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
            Comprehensive safety information:{'\n'}• Local laws and customs
            {'\n'}• Common scams to avoid{'\n'}• Safe transportation tips{'\n'}•
            Health and medical advice{'\n'}• Area-specific warnings
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            🗺️ Safe Routes
          </Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
            Navigate with confidence using well-lit, populated routes with
            real-time safety ratings.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            🔗 API Integration
          </Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
            TODO: Connect to Django endpoints:{'\n'}• GET /safety/guides{'\n'}•
            GET /safety/alerts{'\n'}• GET /safety/emergency-contacts{'\n'}• GET
            /safety/safe-routes
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  alertCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    alignItems: 'center',
  },
  alertIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  alertText: {
    fontSize: 14,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
