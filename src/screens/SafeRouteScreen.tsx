import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../contexts/theme/ThemeContext';
import type { RootStackParamList } from '../navigation/types';
import type { StackScreenProps } from '@react-navigation/stack';

type Props = StackScreenProps<RootStackParamList, 'SafeRoute'>;

const MOCK_WAYPOINTS = [
  {
    id: '1',
    name: 'Current Location',
    address: '123 Market St, San Francisco',
    icon: '📍',
    description: 'Starting point',
    distance: '0 mi',
  },
  {
    id: '2',
    name: 'Union Square',
    address: '333 Post St',
    icon: '🏛️',
    description: 'Well-lit area, high foot traffic',
    distance: '0.3 mi',
  },
  {
    id: '3',
    name: 'Police Station',
    address: '766 Vallejo St',
    icon: '🚓',
    description: 'Emergency services nearby',
    distance: '0.8 mi',
  },
  {
    id: '4',
    name: 'Civic Center Station',
    address: 'Market St & Hyde St',
    icon: '🚇',
    description: 'Transit hub with security cameras',
    distance: '1.2 mi',
  },
  {
    id: '5',
    name: 'Destination',
    address: '456 Mission St, San Francisco',
    icon: '🎯',
    description: 'Your destination',
    distance: '1.5 mi',
  },
];

export default function SafeRouteScreen({ navigation }: Props) {
  const colors = useThemeColors();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentWaypoint, setCurrentWaypoint] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const handleStartNavigation = () => {
    setIsNavigating(true);
    setProgress(0);
    setCurrentWaypoint(0);
    progressAnim.setValue(0);

    // Animate progress bar from 0 to 100% over 8 seconds
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 8000,
      useNativeDriver: false,
    }).start(() => {
      setIsNavigating(false);
      Alert.alert('Arrived! 🎉', 'You have safely reached your destination.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    });

    // Update progress state and waypoint every 2 seconds
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + 25, 100);
        const newWaypoint = Math.floor(
          (newProgress / 100) * MOCK_WAYPOINTS.length
        );
        setCurrentWaypoint(Math.min(newWaypoint, MOCK_WAYPOINTS.length - 1));
        return newProgress;
      });
    }, 2000);
  };

  const handleCancel = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setIsNavigating(false);
    setProgress(0);
    setCurrentWaypoint(0);
    progressAnim.setValue(0);
    Alert.alert(
      'Navigation Cancelled',
      'Safe route navigation has been stopped.'
    );
  };

  const handleEmergency = () => {
    Alert.alert(
      '🚨 Emergency Services',
      'In a real emergency:\n\n• Call 911 immediately\n• Share your live location\n• Contact emergency contacts\n\nThis is a demo app. Always call real emergency services if needed.',
      [{ text: 'OK' }]
    );
  };

  const progressInterpolate = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      {/* Header */}
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
          Safe Route
        </Text>
        <TouchableOpacity
          onPress={handleEmergency}
          style={styles.emergencyButton}
        >
          <Text style={styles.emergencyIcon}>🚨</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Map Preview Placeholder */}
        <View style={[styles.mapContainer, { backgroundColor: colors.card }]}>
          <View
            style={[styles.mapPlaceholder, { backgroundColor: colors.border }]}
          >
            <Text style={styles.mapIcon}>🗺️</Text>
            <Text style={[styles.mapText, { color: colors.textSecondary }]}>
              Safe Route Map Preview
            </Text>
            <Text style={[styles.mapSubtext, { color: colors.textTertiary }]}>
              Well-lit streets • High foot traffic • Security cameras
            </Text>
          </View>
        </View>

        {/* Route Stats */}
        <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
          <View style={styles.stat}>
            <Text style={styles.statIcon}>📏</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Distance
            </Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              1.5 mi
            </Text>
          </View>
          <View
            style={[styles.statDivider, { backgroundColor: colors.border }]}
          />
          <View style={styles.stat}>
            <Text style={styles.statIcon}>⏱️</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Est. Time
            </Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              18 min
            </Text>
          </View>
          <View
            style={[styles.statDivider, { backgroundColor: colors.border }]}
          />
          <View style={styles.stat}>
            <Text style={styles.statIcon}>🛡️</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Safety
            </Text>
            <Text style={[styles.statValue, { color: colors.success }]}>
              High
            </Text>
          </View>
        </View>

        {/* Navigation Progress (shown when navigating) */}
        {isNavigating && (
          <View
            style={[
              styles.progressCard,
              { backgroundColor: colors.success + '15' },
            ]}
          >
            <View style={styles.progressHeader}>
              <Text style={[styles.progressTitle, { color: colors.success }]}>
                🧭 Navigating to Destination
              </Text>
              <TouchableOpacity
                onPress={handleCancel}
                style={styles.cancelButton}
              >
                <Text style={[styles.cancelText, { color: colors.error }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.progressBarTrack,
                { backgroundColor: colors.border },
              ]}
            >
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    backgroundColor: colors.success,
                    width: progressInterpolate,
                  },
                ]}
              />
            </View>
            <Text
              style={[styles.progressText, { color: colors.textSecondary }]}
            >
              {Math.round(progress)}% complete • Waypoint {currentWaypoint + 1}{' '}
              of {MOCK_WAYPOINTS.length}
            </Text>
          </View>
        )}

        {/* Waypoints List */}
        <View style={styles.waypointsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Route Waypoints
          </Text>
          {MOCK_WAYPOINTS.map((waypoint, index) => {
            const isActive = isNavigating && index === currentWaypoint;
            const isCompleted = isNavigating && index < currentWaypoint;

            return (
              <View
                key={waypoint.id}
                style={[
                  styles.waypointCard,
                  {
                    backgroundColor: isActive
                      ? colors.primary + '15'
                      : colors.card,
                    borderColor: isActive ? colors.primary : colors.border,
                  },
                ]}
              >
                <View style={styles.waypointLeft}>
                  <View
                    style={[
                      styles.waypointNumber,
                      {
                        backgroundColor: isCompleted
                          ? colors.success
                          : isActive
                            ? colors.primary
                            : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.waypointNumberText,
                        {
                          color:
                            isCompleted || isActive
                              ? '#FFFFFF'
                              : colors.textSecondary,
                        },
                      ]}
                    >
                      {isCompleted ? '✓' : index + 1}
                    </Text>
                  </View>
                  {index < MOCK_WAYPOINTS.length - 1 && (
                    <View
                      style={[
                        styles.waypointLine,
                        {
                          backgroundColor: isCompleted
                            ? colors.success
                            : colors.border,
                        },
                      ]}
                    />
                  )}
                </View>
                <View style={styles.waypointContent}>
                  <View style={styles.waypointHeader}>
                    <Text style={styles.waypointIcon}>{waypoint.icon}</Text>
                    <Text
                      style={[
                        styles.waypointName,
                        { color: colors.textPrimary },
                      ]}
                    >
                      {waypoint.name}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.waypointAddress,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {waypoint.address}
                  </Text>
                  <Text
                    style={[
                      styles.waypointDescription,
                      { color: colors.textTertiary },
                    ]}
                  >
                    {waypoint.description}
                  </Text>
                  <View style={styles.waypointFooter}>
                    <Text
                      style={[
                        styles.waypointDistance,
                        { color: colors.primary },
                      ]}
                    >
                      📍 {waypoint.distance}
                    </Text>
                    {isActive && (
                      <View
                        style={[
                          styles.activeIndicator,
                          { backgroundColor: colors.primary },
                        ]}
                      >
                        <Text style={styles.activeIndicatorText}>Current</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Safety Features */}
        <View style={[styles.featuresCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.featuresTitle, { color: colors.textPrimary }]}>
            🛡️ Safety Features
          </Text>
          <View style={styles.featuresList}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>💡</Text>
              <Text
                style={[styles.featureText, { color: colors.textSecondary }]}
              >
                Well-lit streets preferred
              </Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>👥</Text>
              <Text
                style={[styles.featureText, { color: colors.textSecondary }]}
              >
                High pedestrian traffic areas
              </Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>📹</Text>
              <Text
                style={[styles.featureText, { color: colors.textSecondary }]}
              >
                Security cameras along route
              </Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🚓</Text>
              <Text
                style={[styles.featureText, { color: colors.textSecondary }]}
              >
                Near police stations & safe zones
              </Text>
            </View>
          </View>
        </View>

        {/* CTA Button */}
        {!isNavigating && (
          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: colors.primary }]}
            onPress={handleStartNavigation}
          >
            <Text style={styles.startButtonIcon}>🧭</Text>
            <Text style={styles.startButtonText}>
              Start Safe Route Navigation
            </Text>
          </TouchableOpacity>
        )}

        {/* Emergency Contact Card */}
        <View
          style={[
            styles.emergencyCard,
            { backgroundColor: colors.error + '15' },
          ]}
        >
          <Text style={styles.emergencyCardIcon}>🚨</Text>
          <View style={styles.emergencyCardContent}>
            <Text style={[styles.emergencyCardTitle, { color: colors.error }]}>
              Emergency Contacts
            </Text>
            <Text
              style={[
                styles.emergencyCardText,
                { color: colors.textSecondary },
              ]}
            >
              911 • Share Location • Alert Friends
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.emergencyCardButton,
              { backgroundColor: colors.error },
            ]}
            onPress={handleEmergency}
          >
            <Text style={styles.emergencyCardButtonText}>SOS</Text>
          </TouchableOpacity>
        </View>

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
  emergencyButton: {
    padding: 4,
  },
  emergencyIcon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  mapContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  mapIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  mapText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  mapSubtext: {
    fontSize: 13,
    textAlign: 'center',
  },
  statsCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statDivider: {
    width: 1,
    marginHorizontal: 8,
  },
  progressCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    padding: 4,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
  },
  waypointsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  waypointCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
  },
  waypointLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  waypointNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waypointNumberText: {
    fontSize: 14,
    fontWeight: '700',
  },
  waypointLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  waypointContent: {
    flex: 1,
  },
  waypointHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  waypointIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  waypointName: {
    fontSize: 16,
    fontWeight: '700',
  },
  waypointAddress: {
    fontSize: 13,
    marginBottom: 4,
  },
  waypointDescription: {
    fontSize: 12,
    marginBottom: 8,
  },
  waypointFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  waypointDistance: {
    fontSize: 13,
    fontWeight: '600',
  },
  activeIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  activeIndicatorText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  featuresCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  featuresList: {
    gap: 12,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  startButtonIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  emergencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  emergencyCardIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  emergencyCardContent: {
    flex: 1,
  },
  emergencyCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  emergencyCardText: {
    fontSize: 13,
  },
  emergencyCardButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emergencyCardButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
