/**
 * @fileoverview News Tab Screen - Travel news, local updates, and safety bulletins
 * @purpose Curated news feed for travelers with category filtering
 * @inputs Optional category filter from navigation params
 * @outputs News articles organized by category
 *
 * TODO: Implement news feed with infinite scroll
 * TODO: Add category filtering (safety, travel, local, general)
 * TODO: Connect to Django API endpoint: /news/feed, /news/categories
 * TODO: Implement bookmarking and sharing functionality
 * TODO: Add push notifications for critical safety news
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../contexts';
import type { NewsStackParamList } from '../navigation/types';
import type { StackScreenProps } from '@react-navigation/stack';

type Props = StackScreenProps<NewsStackParamList, 'News'>;

export default function NewsScreen({ route }: Props) {
  const colors = useThemeColors();
  const { initialCategory } = route.params || {};

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Travel News
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Stay updated on travel trends and safety
          </Text>
        </View>

        {initialCategory && (
          <View
            style={[styles.badge, { backgroundColor: colors.primary + '20' }]}
          >
            <Text style={[styles.badgeText, { color: colors.primary }]}>
              Viewing: {initialCategory}
            </Text>
          </View>
        )}

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            📰 News Categories
          </Text>
          <View style={styles.categoryList}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: colors.error + '20' },
              ]}
            >
              <Text style={[styles.categoryText, { color: colors.error }]}>
                Safety Alerts
              </Text>
            </View>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: colors.primary + '20' },
              ]}
            >
              <Text style={[styles.categoryText, { color: colors.primary }]}>
                Travel Tips
              </Text>
            </View>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: colors.success + '20' },
              ]}
            >
              <Text style={[styles.categoryText, { color: colors.success }]}>
                Local Events
              </Text>
            </View>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: colors.textSecondary + '20' },
              ]}
            >
              <Text
                style={[styles.categoryText, { color: colors.textSecondary }]}
              >
                General News
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            📱 Features
          </Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
            • Curated travel news from trusted sources{'\n'}• Real-time safety
            bulletins{'\n'}• Local event announcements{'\n'}• Bookmarking and
            sharing{'\n'}• Push notifications for critical updates{'\n'}•
            Offline reading support
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            🗂️ Sample Articles
          </Text>
          <View style={styles.article}>
            <Text style={[styles.articleTitle, { color: colors.textPrimary }]}>
              New Travel Guidelines for Europe 2025
            </Text>
            <Text style={[styles.articleMeta, { color: colors.textSecondary }]}>
              Travel Tips • 2 hours ago
            </Text>
          </View>
          <View style={styles.article}>
            <Text style={[styles.articleTitle, { color: colors.textPrimary }]}>
              Safety Alert: Paris Metro Updates
            </Text>
            <Text style={[styles.articleMeta, { color: colors.textSecondary }]}>
              Safety • 5 hours ago
            </Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            🔗 API Integration
          </Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
            TODO: Connect to Django endpoints:{'\n'}• GET
            /news/feed?category=:category{'\n'}• GET /news/categories{'\n'}•
            POST /news/bookmark{'\n'}• GET /news/:newsId
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
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
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
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  article: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  articleMeta: {
    fontSize: 12,
  },
});
