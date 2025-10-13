/**
 * NewsCard Component
 *
 * An optimized, accessible card component for displaying news articles.
 *
 * ACCESSIBILITY FEATURES:
 * - accessibilityRole="button" for interactive card
 * - Comprehensive accessibilityLabel with article metadata
 * - accessibilityHint for action guidance
 * - Image with descriptive accessibilityLabel
 * - Minimum 44px touch target
 * - Sentiment indicator with accessible label
 *
 * PERFORMANCE OPTIMIZATIONS:
 * - React.memo with shallow comparison
 * - Fixed image dimensions prevent layout shift
 * - Avoids inline style calculations
 * - Optimized for FlatList
 *
 * VISUAL SPECIFICATIONS:
 * - Card height: ~180px
 * - Image: 100px height, fixed dimensions
 * - Border radius: 16px
 * - Padding: 16px
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { useThemeColors } from '../contexts/theme/ThemeContext';

interface NewsCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
  sentiment: -1 | 0 | 1;
  biasScore: number;
  onPress: (newsId: string) => void;
}

export const NewsCard: React.FC<NewsCardProps> = React.memo(
  ({
    id,
    title,
    excerpt,
    category,
    source,
    publishedAt,
    imageUrl,
    sentiment,
    biasScore,
    onPress,
  }) => {
    const colors = useThemeColors();

    // Format time for display
    const timeAgo = formatTimeAgo(publishedAt);

    // Sentiment text for accessibility
    const sentimentText =
      sentiment === 1 ? 'positive' : sentiment === -1 ? 'negative' : 'neutral';

    // Bias level for accessibility
    const biasLevel =
      biasScore < 30
        ? 'low bias'
        : biasScore < 60
          ? 'moderate bias'
          : 'high bias';

    // Comprehensive accessibility label
    const accessibilityLabel = `${title}. ${category} article from ${source}, published ${timeAgo}. ${sentimentText} sentiment, ${biasLevel}. ${excerpt}`;

    const handlePress = () => {
      onPress(id);
    };

    // Placeholder image with fixed dimensions
    const placeholderImage = require('../../assets/placeholder-news.png');
    const imageSource: ImageSourcePropType = imageUrl
      ? { uri: imageUrl }
      : placeholderImage;

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card }]}
        onPress={handlePress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint="Double tap to read full article"
        activeOpacity={0.7}
      >
        <View style={styles.row}>
          <Image
            source={imageSource}
            style={styles.image}
            resizeMode="cover"
            accessible={true}
            accessibilityLabel={`${title} article thumbnail`}
            defaultSource={placeholderImage}
          />
          <View style={styles.content}>
            <View style={styles.header}>
              <Text
                style={[styles.category, { color: colors.primary }]}
                numberOfLines={1}
              >
                {category}
              </Text>
              <View
                style={[
                  styles.sentimentBadge,
                  { backgroundColor: getSentimentColor(sentiment) },
                ]}
                accessible={true}
                accessibilityLabel={`${sentimentText} sentiment`}
              >
                <Text style={styles.sentimentIcon}>
                  {getSentimentIcon(sentiment)}
                </Text>
              </View>
            </View>

            <Text
              style={[styles.title, { color: colors.textPrimary }]}
              numberOfLines={2}
            >
              {title}
            </Text>

            <Text
              style={[styles.excerpt, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {excerpt}
            </Text>

            <View style={styles.footer}>
              <Text
                style={[styles.metadata, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
                {source} · {timeAgo}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
  // Shallow comparison for optimal re-rendering
  (prevProps, nextProps) => {
    return (
      prevProps.id === nextProps.id &&
      prevProps.title === nextProps.title &&
      prevProps.sentiment === nextProps.sentiment &&
      prevProps.imageUrl === nextProps.imageUrl
    );
  }
);

NewsCard.displayName = 'NewsCard';

// Helper functions
const getSentimentColor = (sentiment: -1 | 0 | 1): string => {
  if (sentiment === 1) return '#10B981'; // Positive - Green
  if (sentiment === -1) return '#EF4444'; // Negative - Red
  return '#6B7280'; // Neutral - Gray
};

const getSentimentIcon = (sentiment: -1 | 0 | 1): string => {
  if (sentiment === 1) return '😊';
  if (sentiment === -1) return '😟';
  return '😐';
};

const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    overflow: 'hidden',
    minHeight: 44, // Minimum touch target
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    padding: 12,
  },
  image: {
    width: 100, // Fixed width prevents layout shift
    height: 100, // Fixed height prevents layout shift
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  category: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sentimentBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sentimentIcon: {
    fontSize: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 6,
  },
  excerpt: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metadata: {
    fontSize: 12,
  },
});
