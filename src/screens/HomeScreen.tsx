/**
 * HomeScreen - Main Dashboard
 *
 * LAYOUT:
 * - Header: Avatar (left) + ThemeToggle (right)
 * - Greeting: "Good [morning/afternoon/evening], {user.name}"
 * - SearchBar
 * - Featured Routes Carousel (horizontal scroll)
 * - 2x2 Feature Grid (Explore, Safety, News, Profile)
 *
 * INTERACTIONS:
 * - Pull-to-refresh refreshes mock feed
 * - Tapping featured route navigates to RouteDetails
 * - Feature cards navigate to respective screens
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../contexts/theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { MainTabParamList } from '../navigation/types';
import { useAuth } from '../contexts/auth/AuthContext';
import { ThemeToggle, SearchBar, Avatar } from '../components';
import { FEATURED_ROUTES, MOCK_USER } from '../data/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 48;

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export default function HomeScreen() {
  const colors = useThemeColors();
  const { user } = useAuth();

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [routes, setRoutes] = useState(FEATURED_ROUTES);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRoutes([...FEATURED_ROUTES]);
    setRefreshing(false);
  };

  const handleRoutePress = (routeId: string) => {
    console.log('Navigate to route:', routeId);
    // TODO: navigation.navigate('RouteDetails', { routeId });
  };

  const handleSearch = () => {
    console.log('Search for:', searchQuery);
    // TODO: Navigate to Explore with search query
  };

  const navigation = useNavigation<NavigationProp<MainTabParamList>>();

  const goToTab = (tab: keyof MainTabParamList) => {
    // Navigate to the top-level tab navigator
    navigation.navigate(tab as any);
  };

  const formatDistance = (meters: number): string => {
    const km = meters / 1000;
    return km < 1 ? `${meters}m` : `${km.toFixed(1)}km`;
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    return mins === 0 ? `${hours}h` : `${hours}h ${mins}min`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Avatar src={MOCK_USER.avatar} initials={MOCK_USER.name} size={44} />
          <ThemeToggle size={20} />
        </View>

        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>{getGreeting()},</Text>
          <Text style={[styles.userName, { color: colors.textPrimary }]}>
            {user?.name || MOCK_USER.name}
          </Text>
        </View>

        {/* SearchBar */}
        <View style={styles.searchSection}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search routes, places..."
            onSubmit={handleSearch}
          />
        </View>

        {/* Featured Routes Carousel */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Featured Routes</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
            snapToInterval={CARD_WIDTH + 16}
            decelerationRate="fast"
          >
            {routes.map(route => (
              <TouchableOpacity
                key={route.id}
                onPress={() => handleRoutePress(route.id)}
                style={[styles.featuredCard, { backgroundColor: colors.card }]}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: route.thumbnailUrl }}
                  style={styles.featuredImage}
                  resizeMode="cover"
                />
                <View style={styles.featuredOverlay}>
                  <View style={styles.featuredContent}>
                    <Text style={styles.featuredTitle} numberOfLines={2}>
                      {route.title}
                    </Text>
                    <Text style={styles.featuredLocation} numberOfLines={1}>
                      📍 {route.location}
                    </Text>
                    <View style={styles.featuredStats}>
                      <Text style={styles.featuredStat}>
                        🚶 {formatDistance(route.distanceMeters)}
                      </Text>
                      <Text style={styles.featuredStat}>•</Text>
                      <Text style={styles.featuredStat}>
                        ⏱️ {formatDuration(route.estimatedMinutes)}
                      </Text>
                      <Text style={styles.featuredStat}>•</Text>
                      <Text style={styles.featuredStat}>⭐ {route.rating}</Text>
                    </View>
                    <View style={styles.tagsRow}>
                      {route.tags.slice(0, 3).map((tag, index) => (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 2x2 Feature Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Quick Access</Text>
          <View style={styles.featureGrid}>
            <TouchableOpacity
              style={[
                styles.featureCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => goToTab('ExploreTab')}
              activeOpacity={0.7}
            >
              <View style={[styles.featureIcon, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="compass" size={28} color={colors.primary} />
              </View>
              <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>Explore</Text>
              <Text style={[styles.featureSubtitle, { color: colors.textSecondary }]}>
                Discover routes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.featureCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => goToTab('SafetyTab')}
              activeOpacity={0.7}
            >
              <View style={[styles.featureIcon, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="shield-checkmark" size={28} color="#DC2626" />
              </View>
              <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>Safety</Text>
              <Text style={[styles.featureSubtitle, { color: colors.textSecondary }]}>
                Stay informed
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.featureCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => goToTab('NewsTab')}
              activeOpacity={0.7}
            >
              <View style={[styles.featureIcon, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="newspaper" size={28} color="#2563EB" />
              </View>
              <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>News</Text>
              <Text style={[styles.featureSubtitle, { color: colors.textSecondary }]}>
                Latest updates
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.featureCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => goToTab('ProfileTab')}
              activeOpacity={0.7}
            >
              <View style={[styles.featureIcon, { backgroundColor: '#FCE7F3' }]}>
                <Ionicons name="person" size={28} color="#DB2777" />
              </View>
              <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>Profile</Text>
              <Text style={[styles.featureSubtitle, { color: colors.textSecondary }]}>
                Your account
              </Text>
            </TouchableOpacity>
          </View>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  greetingSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  searchSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  carousel: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  featuredCard: {
    width: CARD_WIDTH,
    height: 240,
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  featuredContent: {
    padding: 16,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featuredLocation: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  featuredStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featuredStat: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    marginRight: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginTop: 4,
  },
  tagText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  featureCard: {
    width: (SCREEN_WIDTH - 44) / 2,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureEmoji: {
    fontSize: 28,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureSubtitle: {
    fontSize: 12,
  },
});
