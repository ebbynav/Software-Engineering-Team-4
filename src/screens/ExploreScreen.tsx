/**
 * @fileoverview Explore Tab Screen - Discover destinations, attractions, and local spots
 * @purpose Main exploration interface for finding places and experiences
 * @inputs Optional city filter and category from navigation params
 * @outputs Interactive explore interface with search and filters
 *
 * TODO: Implement city search and autocomplete
 * TODO: Add category filters (restaurants, attractions, nightlife, outdoor)
 * TODO: Connect to Django API endpoint: /explore/cities, /explore/places
 * TODO: Implement map view toggle
 * TODO: Add user location detection and nearby places
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../contexts';
import type { ExploreStackParamList } from '../navigation/types';
import type { StackScreenProps } from '@react-navigation/stack';

type Props = StackScreenProps<ExploreStackParamList, 'Explore'>;

export default function ExploreScreen({ route }: Props) {
  const colors = useThemeColors();
  const { initialCity, initialCategory } = route.params || {};

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Explore
          </Text>
          {initialCity && (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {initialCity}
            </Text>
          )}
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            🌍 Discover New Places
          </Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
            Search cities, explore attractions, find hidden gems.
          </Text>
          {initialCategory && (
            <Text
              style={[
                styles.badge,
                {
                  backgroundColor: colors.primary + '20',
                  color: colors.primary,
                },
              ]}
            >
              Category: {initialCategory}
            </Text>
          )}
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            📍 Search Features
          </Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
            • City search with autocomplete{'\n'}• Category filters
            (restaurants, attractions, nightlife){'\n'}• Map view toggle{'\n'}•
            Nearby places detection{'\n'}• User reviews and ratings
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            🔗 API Integration
          </Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
            TODO: Connect to Django endpoints:{'\n'}• GET /explore/cities{'\n'}•
            GET /explore/places{'\n'}• GET /explore/categories
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
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 12,
    fontSize: 12,
    fontWeight: '600',
  },
});
