import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../contexts/theme/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { SAFETY_ALERTS } from '../data/mockData';
import type { SafetyAlert } from '../data/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type SafetyStatus = 'safe' | 'caution' | 'alert';

export default function SafetyScreen() {
  const colors = useThemeColors();
  const [safetyStatus, setSafetyStatus] = useState<SafetyStatus>('safe');
  const [alerts, setAlerts] = useState<SafetyAlert[]>(SAFETY_ALERTS);
  const emergencyScale = useRef(new Animated.Value(1)).current;
  const statusPulse = useRef(new Animated.Value(1)).current;

  // Pulse animation for status indicator
  React.useEffect(() => {
    if (safetyStatus === 'alert') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(statusPulse, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(statusPulse, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      statusPulse.setValue(1);
    }
  }, [safetyStatus, statusPulse]);

  const handleEmergencyPress = () => {
    // Bounce animation
    Animated.sequence([
      Animated.spring(emergencyScale, {
        toValue: 0.9,
        useNativeDriver: true,
      }),
      Animated.spring(emergencyScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    Alert.alert(
      '🚨 Emergency Alert',
      'Are you sure you want to trigger an emergency alert? This will notify your emergency contacts and local authorities.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          style: 'destructive',
          onPress: () => {
            setSafetyStatus('alert');
            Alert.alert(
              'Alert Sent',
              'Emergency services have been notified and your location has been shared with emergency contacts.'
            );
          },
        },
      ]
    );
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'share-location':
        Alert.alert(
          'Share Location',
          'Your live location is now being shared with trusted contacts.'
        );
        break;
      case 'call-emergency':
        Alert.alert('Emergency Call', 'Calling emergency services...');
        break;
      case 'alert-contacts':
        Alert.alert(
          'Alert Contacts',
          'Emergency contacts have been notified of your situation.'
        );
        break;
      case 'safe-route':
        Alert.alert(
          'Safe Route',
          'Finding the safest route to your destination...'
        );
        break;
    }
  };

  const handleDismissAlert = (alertId: string) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
  };

  const getStatusColor = (): string => {
    switch (safetyStatus) {
      case 'safe':
        return '#10B981'; // green
      case 'caution':
        return '#F59E0B'; // amber
      case 'alert':
        return '#EF4444'; // red
    }
  };

  const getStatusText = (): string => {
    switch (safetyStatus) {
      case 'safe':
        return 'You are safe';
      case 'caution':
        return 'Exercise caution';
      case 'alert':
        return 'Alert active';
    }
  };

  const getStatusIcon = (): string => {
    switch (safetyStatus) {
      case 'safe':
        return '✓';
      case 'caution':
        return '⚠';
      case 'alert':
        return '🚨';
    }
  };

  const getAlertIcon = (severity: SafetyAlert['severity']): string => {
    if (severity >= 4) return '🚨';
    if (severity >= 3) return '⚠️';
    return 'ℹ️';
  };

  const getAlertColor = (severity: SafetyAlert['severity']): string => {
    if (severity >= 4) return '#EF4444'; // high
    if (severity >= 3) return '#F59E0B'; // medium
    return '#3B82F6'; // low
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now.getTime() - alertTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getAlertTitle = (alert: SafetyAlert): string => {
    // Generate a title from the type
    switch (alert.type) {
      case 'crowd':
        return 'High Crowd Density';
      case 'accident':
        return 'Traffic Accident';
      case 'closure':
        return 'Road Closure';
      case 'weather':
        return 'Weather Alert';
      case 'crime':
        return 'Safety Alert';
      default:
        return 'Alert';
    }
  };

  const calculateDistance = (lat: number, lng: number): string => {
    // Simple mock distance calculation (in real app, use user's location)
    const mockDistance = Math.abs(lat - 37.7749) + Math.abs(lng + 122.4194);
    const km = mockDistance * 100; // approximate conversion
    if (km < 1) return `${Math.round(km * 1000)}m away`;
    return `${km.toFixed(1)}km away`;
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
            Safety Companion
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Stay safe on your journey
          </Text>
        </View>
        <ThemeToggle />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Indicator */}
        <View style={[styles.statusCard, { backgroundColor: colors.card }]}>
          <View style={styles.statusHeader}>
            <Animated.View
              style={[
                styles.statusIndicator,
                {
                  backgroundColor: getStatusColor(),
                  transform: [{ scale: statusPulse }],
                },
              ]}
            >
              <Text style={styles.statusIcon}>{getStatusIcon()}</Text>
            </Animated.View>
            <View style={styles.statusTextContainer}>
              <Text style={[styles.statusTitle, { color: colors.textPrimary }]}>
                {getStatusText()}
              </Text>
              <Text
                style={[styles.statusSubtitle, { color: colors.textSecondary }]}
              >
                Last updated: Just now
              </Text>
            </View>
          </View>

          {safetyStatus === 'alert' && (
            <TouchableOpacity
              style={[
                styles.cancelButton,
                { backgroundColor: colors.error + '20' },
              ]}
              onPress={() => {
                setSafetyStatus('safe');
                Alert.alert(
                  'Alert Cancelled',
                  'Emergency alert has been cancelled.'
                );
              }}
            >
              <Text style={[styles.cancelButtonText, { color: colors.error }]}>
                Cancel Alert
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Emergency Button */}
        <Animated.View style={[{ transform: [{ scale: emergencyScale }] }]}>
          <TouchableOpacity
            style={[styles.emergencyButton, { backgroundColor: colors.error }]}
            onPress={handleEmergencyPress}
            activeOpacity={0.8}
          >
            <View style={styles.emergencyContent}>
              <Text style={styles.emergencyIcon}>🚨</Text>
              <Text style={styles.emergencyTitle}>EMERGENCY</Text>
              <Text style={styles.emergencySubtitle}>Tap to alert</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={[styles.quickActionCard, { backgroundColor: colors.card }]}
              onPress={() => handleQuickAction('share-location')}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: colors.primary + '20' },
                ]}
              >
                <Text style={styles.quickActionEmoji}>📍</Text>
              </View>
              <Text
                style={[styles.quickActionText, { color: colors.textPrimary }]}
              >
                Share Location
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionCard, { backgroundColor: colors.card }]}
              onPress={() => handleQuickAction('call-emergency')}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: '#10B981' + '20' },
                ]}
              >
                <Text style={styles.quickActionEmoji}>📞</Text>
              </View>
              <Text
                style={[styles.quickActionText, { color: colors.textPrimary }]}
              >
                Call Emergency
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionCard, { backgroundColor: colors.card }]}
              onPress={() => handleQuickAction('alert-contacts')}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: '#F59E0B' + '20' },
                ]}
              >
                <Text style={styles.quickActionEmoji}>👥</Text>
              </View>
              <Text
                style={[styles.quickActionText, { color: colors.textPrimary }]}
              >
                Alert Contacts
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionCard, { backgroundColor: colors.card }]}
              onPress={() => handleQuickAction('safe-route')}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: '#8B5CF6' + '20' },
                ]}
              >
                <Text style={styles.quickActionEmoji}>🛡️</Text>
              </View>
              <Text
                style={[styles.quickActionText, { color: colors.textPrimary }]}
              >
                Safe Route
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Live Alerts Feed */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Live Alerts
            </Text>
            <View
              style={[
                styles.liveBadge,
                { backgroundColor: colors.error + '20' },
              ]}
            >
              <View
                style={[styles.liveDot, { backgroundColor: colors.error }]}
              />
              <Text style={[styles.liveText, { color: colors.error }]}>
                LIVE
              </Text>
            </View>
          </View>

          {alerts.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
              <Text style={styles.emptyIcon}>✓</Text>
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                No Active Alerts
              </Text>
              <Text
                style={[styles.emptySubtitle, { color: colors.textSecondary }]}
              >
                Your area is currently safe
              </Text>
            </View>
          ) : (
            alerts.map(alert => (
              <View
                key={alert.id}
                style={[
                  styles.alertCard,
                  {
                    backgroundColor: colors.card,
                    borderLeftColor: getAlertColor(alert.severity),
                  },
                ]}
              >
                <View style={styles.alertHeader}>
                  <View style={styles.alertTitleRow}>
                    <Text style={styles.alertIcon}>
                      {getAlertIcon(alert.severity)}
                    </Text>
                    <View style={styles.alertTitleContainer}>
                      <Text
                        style={[
                          styles.alertTitle,
                          { color: colors.textPrimary },
                        ]}
                      >
                        {getAlertTitle(alert)}
                      </Text>
                      <Text
                        style={[
                          styles.alertType,
                          { color: getAlertColor(alert.severity) },
                        ]}
                      >
                        {alert.type.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDismissAlert(alert.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text
                      style={[
                        styles.dismissButton,
                        { color: colors.textSecondary },
                      ]}
                    >
                      ✕
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text
                  style={[
                    styles.alertDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  {alert.detailText}
                </Text>

                <View style={styles.alertFooter}>
                  <View style={styles.alertLocationRow}>
                    <Text
                      style={[
                        styles.alertLocation,
                        { color: colors.textSecondary },
                      ]}
                    >
                      📍 {alert.location}
                    </Text>
                    <Text
                      style={[
                        styles.alertDistance,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {calculateDistance(alert.lat, alert.lng)}
                    </Text>
                  </View>
                  <Text
                    style={[styles.alertTime, { color: colors.textTertiary }]}
                  >
                    {formatTimeAgo(alert.timestamp)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Emergency Contacts */}
        <View style={[styles.section, { marginBottom: 24 }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Emergency Contacts
          </Text>

          <TouchableOpacity
            style={[styles.contactCard, { backgroundColor: colors.card }]}
            onPress={() => Alert.alert('Emergency Services', 'Calling 911...')}
          >
            <View
              style={[
                styles.contactIcon,
                { backgroundColor: colors.error + '20' },
              ]}
            >
              <Text style={styles.contactEmoji}>🚨</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={[styles.contactName, { color: colors.textPrimary }]}>
                Emergency Services
              </Text>
              <Text
                style={[styles.contactNumber, { color: colors.textSecondary }]}
              >
                911
              </Text>
            </View>
            <Text style={[styles.contactArrow, { color: colors.textTertiary }]}>
              →
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.contactCard, { backgroundColor: colors.card }]}
            onPress={() =>
              Alert.alert('Primary Contact', 'Calling primary contact...')
            }
          >
            <View
              style={[
                styles.contactIcon,
                { backgroundColor: colors.primary + '20' },
              ]}
            >
              <Text style={styles.contactEmoji}>👤</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={[styles.contactName, { color: colors.textPrimary }]}>
                Primary Contact
              </Text>
              <Text
                style={[styles.contactNumber, { color: colors.textSecondary }]}
              >
                +1 (555) 123-4567
              </Text>
            </View>
            <Text style={[styles.contactArrow, { color: colors.textTertiary }]}>
              →
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.contactCard, { backgroundColor: colors.card }]}
            onPress={() =>
              Alert.alert('Secondary Contact', 'Calling secondary contact...')
            }
          >
            <View
              style={[
                styles.contactIcon,
                { backgroundColor: colors.primary + '20' },
              ]}
            >
              <Text style={styles.contactEmoji}>👤</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={[styles.contactName, { color: colors.textPrimary }]}>
                Secondary Contact
              </Text>
              <Text
                style={[styles.contactNumber, { color: colors.textSecondary }]}
              >
                +1 (555) 987-6543
              </Text>
            </View>
            <Text style={[styles.contactArrow, { color: colors.textTertiary }]}>
              →
            </Text>
          </TouchableOpacity>
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
  statusCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusIcon: {
    fontSize: 28,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 13,
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emergencyButton: {
    height: 180,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  emergencyContent: {
    alignItems: 'center',
  },
  emergencyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emergencyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 2,
  },
  emergencySubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  quickActionCard: {
    width: (SCREEN_WIDTH - 52) / 2,
    margin: 6,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionEmoji: {
    fontSize: 28,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  alertCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  alertTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  alertTitleContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  alertType: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dismissButton: {
    fontSize: 20,
    fontWeight: '600',
    paddingHorizontal: 4,
  },
  alertDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  alertFooter: {
    gap: 8,
  },
  alertLocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertLocation: {
    fontSize: 13,
    flex: 1,
  },
  alertDistance: {
    fontSize: 13,
    fontWeight: '600',
  },
  alertTime: {
    fontSize: 12,
  },
  emptyState: {
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactEmoji: {
    fontSize: 24,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  contactNumber: {
    fontSize: 14,
  },
  contactArrow: {
    fontSize: 20,
  },
});
