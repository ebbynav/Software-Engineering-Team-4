/**
 * @fileoverview RouteCard - Specialized card for displaying route information
 * @purpose Shows route details with map preview, stats, and action buttons
 *
 * COMPONENT CONTRACT:
 *
 * Props:
 * - title: string - Route name
 * - distance: string - Route distance (e.g., "5.2 km")
 * - duration: string - Estimated time (e.g., "2h 30min")
 * - tags: string[] - Route characteristics (e.g., ["Safe", "Scenic"])
 * - mapPreview?: string - URL for map thumbnail
 * - isSaved?: boolean - Whether route is bookmarked
 * - onPress: () => void - Handler for card press
 * - onToggleSave: () => void - Handler for save/heart button
 * - style?: ViewStyle - Additional custom styles
 * - testID?: string - Testing identifier
 *
 * Visual Specifications:
 * - Layout: Vertical card with map preview on top
 * - Map preview: 16:9 aspect ratio, placeholder if no image
 * - Title: 18px, semibold, textPrimary
 * - Stats: Inline, 14px, textSecondary, with icons
 * - Tags: Pill chips, horizontally scrollable
 * - Save button: Heart icon (filled when saved), top-right overlay
 * - Card: Rounded 12px, shadow elevation
 *
 * Behavior:
 * - Entire card is pressable (opens route details)
 * - Save button stops propagation (only toggles save)
 * - Tags are non-interactive display only
 * - Scale animation on press
 *
 * EXAMPLE USAGE:
 * ```tsx
 * <RouteCard
 *   title="Historic Paris Walking Tour"
 *   distance="5.2 km"
 *   duration="2h 30min"
 *   tags={["Safe", "Scenic", "Historic"]}
 *   mapPreview="https://..."
 *   isSaved={false}
 *   onPress={() => navigate('RouteDetails', { routeId: '123' })}
 *   onToggleSave={() => toggleSave('123')}
 * />
 * ```
 *
 * TODO: Add difficulty indicator
 * TODO: Add user rating display
 * TODO: Add real map preview integration
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ViewStyle,
  Platform,
  ScrollView,
} from 'react-native';
import { useThemeColors } from '../../contexts';

interface RouteCardProps {
  title: string;
  distance: string;
  duration: string;
  tags: string[];
  mapPreview?: string;
  isSaved?: boolean;
  onPress: () => void;
  onToggleSave: () => void;
  style?: ViewStyle;
  testID?: string;
}

export const RouteCard = React.memo<RouteCardProps>(
  ({
    title,
    distance,
    duration,
    tags,
    mapPreview,
    isSaved = false,
    onPress,
    onToggleSave,
    style,
    testID,
  }) => {
    const colors = useThemeColors();
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    const handleSavePress = (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      onToggleSave();
    };

    return (
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel={`Route: ${title}, ${distance}, ${duration}`}
          testID={testID}
          style={[
            styles.card,
            { backgroundColor: colors.card },
            Platform.OS === 'ios' ? styles.shadowIOS : styles.shadowAndroid,
          ]}
        >
          {/* Map Preview */}
          <View style={styles.mapContainer}>
            {mapPreview ? (
              <Image source={{ uri: mapPreview }} style={styles.mapImage} resizeMode="cover" />
            ) : (
              <View style={[styles.mapPlaceholder, { backgroundColor: colors.border }]}>
                <Text style={[styles.mapIcon, { color: colors.textSecondary }]}>🗺️</Text>
              </View>
            )}
            {/* Save Button Overlay */}
            <TouchableOpacity
              onPress={handleSavePress}
              style={[styles.saveButton, { backgroundColor: colors.card }]}
              accessibilityRole="button"
              accessibilityLabel={isSaved ? 'Remove from saved' : 'Save route'}
            >
              <Text style={styles.saveIcon}>{isSaved ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>
              {title}
            </Text>

            {/* Stats */}
            <View style={styles.stats}>
              <Text style={[styles.stat, { color: colors.textSecondary }]}>📍 {distance}</Text>
              <Text style={[styles.statDivider, { color: colors.textSecondary }]}>•</Text>
              <Text style={[styles.stat, { color: colors.textSecondary }]}>⏱️ {duration}</Text>
            </View>

            {/* Tags */}
            {tags.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.tagsContainer}
                contentContainerStyle={styles.tagsContent}
              >
                {tags.map((tag, index) => (
                  <View
                    key={index}
                    style={[styles.tag, { backgroundColor: `${colors.primary}20` }]}
                  >
                    <Text style={[styles.tagText, { color: colors.primary }]}>{tag}</Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

RouteCard.displayName = 'RouteCard';

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 16 / 9,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapIcon: {
    fontSize: 48,
  },
  saveButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveIcon: {
    fontSize: 20,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stat: {
    fontSize: 14,
  },
  statDivider: {
    marginHorizontal: 8,
  },
  tagsContainer: {
    marginTop: 4,
  },
  tagsContent: {
    gap: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  shadowIOS: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  shadowAndroid: {
    elevation: 2,
  },
});
