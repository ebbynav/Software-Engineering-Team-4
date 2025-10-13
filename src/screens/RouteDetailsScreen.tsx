/**
 * @fileoverview Route Details Screen - Detailed view of a specific route with waypoints
 * @purpose Shows complete route information, waypoints, reviews, and safety ratings
 * @inputs routeId, optional initialWaypointIndex, optional source tracking
 * @outputs Interactive route details with map, waypoints, and user actions
 *
 * TODO: Implement interactive map with route visualization
 * TODO: Add waypoint list with expand/collapse functionality
 * TODO: Connect to Django API endpoint: /routes/:routeId
 * TODO: Implement save/bookmark functionality
 * TODO: Add share route feature
 * TODO: Show safety ratings and real-time alerts
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
import type { RootStackParamList } from '../navigation/types';
import type { StackScreenProps } from '@react-navigation/stack';

type Props = StackScreenProps<RootStackParamList, 'RouteDetails'>;

export default function RouteDetailsScreen({ route, navigation }: Props) {
  const colors = useThemeColors();
  const { routeId, initialWaypointIndex, source } = route.params;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <View
        style={[
          styles.header,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={[styles.backText, { color: colors.primary }]}>
            ‹ Back
          </Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Route Details
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.routeTitle, { color: colors.textPrimary }]}>
            🗺️ Historic Paris Walking Tour
          </Text>
          <Text style={[styles.routeMeta, { color: colors.textSecondary }]}>
            5.2 km • 2h 30min • Easy
          </Text>
          <View style={styles.safetyBadge}>
            <Text style={[styles.safetyText, { color: colors.success }]}>
              ✓ Safe Route
            </Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            📍 Route Information
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Route ID: {routeId}
          </Text>
          {initialWaypointIndex !== undefined && (
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Starting at waypoint: {initialWaypointIndex}
            </Text>
          )}
          {source && (
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Opened from: {source}
            </Text>
          )}
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            🚶 Waypoints
          </Text>
          <View style={styles.waypoint}>
            <View
              style={[styles.waypointDot, { backgroundColor: colors.primary }]}
            />
            <View style={styles.waypointContent}>
              <Text
                style={[styles.waypointTitle, { color: colors.textPrimary }]}
              >
                Eiffel Tower
              </Text>
              <Text
                style={[styles.waypointDesc, { color: colors.textSecondary }]}
              >
                Starting point • Iconic landmark
              </Text>
            </View>
          </View>
          <View
            style={[styles.waypointLine, { backgroundColor: colors.border }]}
          />
          <View style={styles.waypoint}>
            <View
              style={[styles.waypointDot, { backgroundColor: colors.primary }]}
            />
            <View style={styles.waypointContent}>
              <Text
                style={[styles.waypointTitle, { color: colors.textPrimary }]}
              >
                Champ de Mars
              </Text>
              <Text
                style={[styles.waypointDesc, { color: colors.textSecondary }]}
              >
                0.5 km • Beautiful gardens
              </Text>
            </View>
          </View>
          <View
            style={[styles.waypointLine, { backgroundColor: colors.border }]}
          />
          <View style={styles.waypoint}>
            <View
              style={[styles.waypointDot, { backgroundColor: colors.primary }]}
            />
            <View style={styles.waypointContent}>
              <Text
                style={[styles.waypointTitle, { color: colors.textPrimary }]}
              >
                Pont de l'Alma
              </Text>
              <Text
                style={[styles.waypointDesc, { color: colors.textSecondary }]}
              >
                1.2 km • Historic bridge
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            ⭐ Reviews & Ratings
          </Text>
          <Text style={[styles.rating, { color: colors.primary }]}>
            4.8 / 5.0 (324 reviews)
          </Text>
          <Text style={[styles.reviewText, { color: colors.textSecondary }]}>
            "Amazing route! Felt very safe walking even at night."
          </Text>
        </View>

        <View style={[styles.actionButtons]}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.primaryButtonText}>Start Route</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: colors.border }]}
          >
            <Text
              style={[
                styles.secondaryButtonText,
                { color: colors.textPrimary },
              ]}
            >
              Save for Later
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            🔗 API Integration
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            TODO: Connect to Django endpoint:{'\n'}• GET /routes/:routeId{'\n'}•
            POST /routes/:routeId/save{'\n'}• POST /routes/:routeId/review
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  backText: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  routeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  routeMeta: {
    fontSize: 14,
    marginBottom: 12,
  },
  safetyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    borderRadius: 16,
  },
  safetyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  waypoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  waypointDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  waypointLine: {
    width: 2,
    height: 24,
    marginLeft: 5,
    marginVertical: 4,
  },
  waypointContent: {
    flex: 1,
  },
  waypointTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  waypointDesc: {
    fontSize: 14,
  },
  rating: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 16,
  },
  primaryButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
