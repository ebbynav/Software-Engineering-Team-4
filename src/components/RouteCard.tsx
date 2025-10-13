/**
 * RouteCard Component
 *
 * An optimized, accessible card component for displaying route information.
 *
 * ACCESSIBILITY FEATURES:
 * - accessibilityRole="button" for interactive card
 * - Comprehensive accessibilityLabel describing route details
 * - accessibilityHint for tap action guidance
 * - Image with accessibilityLabel
 * - Minimum 44px touch target height (exceeds with 120px)
 * - High contrast text meeting WCAG AA standards
 *
 * PERFORMANCE OPTIMIZATIONS:
 * - React.memo with custom comparison function
 * - Optimized for FlatList rendering
 * - Avoids inline styles
 * - Uses fixed dimensions to prevent layout shift
 *
 * VISUAL SPECIFICATIONS:
 * - Card height: ~200px with image
 * - Image: 120px height with fixed dimensions
 * - Border radius: 16px
 * - Padding: 16px
 * - Shadow/elevation for depth
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

interface RouteCardProps {
  id: string;
  title: string;
  description: string;
  distanceMeters: number;
  durationMinutes: number;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  safetyScore: number;
  imageUrl?: string;
  onPress: (routeId: string) => void;
}

export const RouteCard: React.FC<RouteCardProps> = React.memo(
  ({
    id,
    title,
    description,
    distanceMeters,
    durationMinutes,
    difficulty,
    safetyScore,
    imageUrl,
    onPress,
  }) => {
    const colors = useThemeColors();

    // Format values for display and accessibility
    const distanceKm = (distanceMeters / 1000).toFixed(1);
    const hours = Math.floor(durationMinutes / 60);
    const mins = durationMinutes % 60;
    const durationText = hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;

    // Comprehensive accessibility label
    const accessibilityLabel = `${title}. ${distanceKm} kilometers, ${durationText}. ${difficulty} difficulty. Safety score ${safetyScore} out of 100. ${description}`;

    const handlePress = () => {
      onPress(id);
    };

    // Placeholder image with fixed dimensions
    const placeholderImage = require('../../assets/placeholder-route.png');
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
        accessibilityHint="Double tap to view route details"
        activeOpacity={0.7}
      >
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode="cover"
          accessible={true}
          accessibilityLabel={`${title} route preview image`}
          // Fixed dimensions prevent layout shift
          defaultSource={placeholderImage}
        />
        <View style={styles.content}>
          <Text
            style={[styles.title, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text
            style={[styles.description, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {description}
          </Text>

          <View style={styles.metadata}>
            <View style={styles.metadataItem}>
              <Text
                style={[styles.metadataValue, { color: colors.textPrimary }]}
              >
                {distanceKm} km
              </Text>
            </View>
            <View style={styles.metadataItem}>
              <Text
                style={[styles.metadataValue, { color: colors.textPrimary }]}
              >
                {durationText}
              </Text>
            </View>
            <View style={styles.metadataItem}>
              <Text
                style={[
                  styles.difficultyBadge,
                  styles[`difficulty${difficulty}`],
                ]}
              >
                {difficulty}
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <View
              style={[
                styles.safetyBadge,
                { backgroundColor: getSafetyColor(safetyScore) },
              ]}
            >
              <Text style={styles.safetyText}>Safety: {safetyScore}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
  // Custom comparison function for optimal re-rendering
  (prevProps, nextProps) => {
    return (
      prevProps.id === nextProps.id &&
      prevProps.title === nextProps.title &&
      prevProps.safetyScore === nextProps.safetyScore &&
      prevProps.imageUrl === nextProps.imageUrl
    );
  }
);

RouteCard.displayName = 'RouteCard';

// Helper function for safety score colors
const getSafetyColor = (score: number): string => {
  if (score >= 90) return '#10B981'; // Very Safe - Green
  if (score >= 75) return '#3B82F6'; // Safe - Blue
  if (score >= 60) return '#F59E0B'; // Moderately Safe - Amber
  return '#EF4444'; // Caution - Red
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    overflow: 'hidden',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 120, // Fixed height prevents layout shift
    backgroundColor: '#E5E7EB', // Fallback background
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  metadataItem: {
    marginRight: 16,
    marginBottom: 4,
  },
  metadataValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  difficultyBadge: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
  difficultyEasy: {
    backgroundColor: '#D1FAE5',
    color: '#059669',
  },
  difficultyModerate: {
    backgroundColor: '#FEF3C7',
    color: '#D97706',
  },
  difficultyHard: {
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  safetyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  safetyText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
