/**
 * @fileoverview Card - Versatile content container with optional image header
 * @purpose Provides consistent card layout for content throughout the app
 *
 * COMPONENT CONTRACT:
 *
 * Props:
 * - title: string - Primary heading text
 * - subtitle?: string - Optional secondary text below title
 * - image?: string | number - URL or local require() asset for header image
 * - children?: ReactNode - Content to render in card body
 * - onPress?: () => void - Makes card clickable/tappable
 * - style?: ViewStyle - Additional custom styles
 * - testID?: string - Testing identifier
 *
 * Visual Specifications:
 * - Shape: Rounded rectangle (12px border radius)
 * - Background: theme.colors.card
 * - Elevation: Subtle shadow (iOS shadow, Android elevation 2)
 * - Image: Covers top third if provided, 16:9 aspect ratio
 * - Padding: 16px all sides (20px if no image)
 * - Title: 18px, semibold (600), textPrimary
 * - Subtitle: 14px, regular, textSecondary
 * - Gap: 8px between title and subtitle
 *
 * Behavior:
 * - If onPress provided: Shows press feedback (scale 0.98)
 * - If onPress provided: accessibilityRole="button"
 * - Image loads with ResizeMode.cover
 * - Children render below title/subtitle
 * - Non-clickable by default (no press feedback)
 *
 * Accessibility:
 * - accessibilityRole="button" when clickable
 * - accessibilityLabel combines title + subtitle
 * - Image has accessibilityIgnoresInvertColors
 *
 * EXAMPLE USAGE:
 * ```tsx
 * // Basic card
 * <Card
 *   title="Welcome to WayTrove"
 *   subtitle="Discover safe travel routes"
 * />
 *
 * // Card with image
 * <Card
 *   title="Paris Walking Tour"
 *   subtitle="5.2 km • 2 hours"
 *   image="https://example.com/paris.jpg"
 * />
 *
 * // Clickable card with custom content
 * <Card
 *   title="Route Details"
 *   onPress={handlePress}
 * >
 *   <Text>Custom content goes here</Text>
 * </Card>
 *
 * // Card with local image
 * <Card
 *   title="Featured"
 *   image={require('../../assets/images/featured.png')}
 * />
 * ```
 *
 * TODO: Add loading skeleton state
 * TODO: Support multiple image aspect ratios
 * TODO: Add ribbon/badge overlay option
 */

import React, { useRef, ReactNode } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ViewStyle,
  Platform,
  ImageSourcePropType,
} from 'react-native';
import { useThemeColors } from '../../contexts';

interface CardProps {
  title: string;
  subtitle?: string;
  image?: string | ImageSourcePropType;
  children?: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  testID?: string;
}

export const Card = React.memo<CardProps>(
  ({ title, subtitle, image, children, onPress, style, testID }) => {
    const colors = useThemeColors();
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const isClickable = !!onPress;

    const handlePressIn = () => {
      if (isClickable) {
        Animated.spring(scaleAnim, {
          toValue: 0.98,
          useNativeDriver: true,
        }).start();
      }
    };

    const handlePressOut = () => {
      if (isClickable) {
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }).start();
      }
    };

    const imageSource =
      typeof image === 'string'
        ? { uri: image }
        : (image as ImageSourcePropType);

    const accessibilityLabel = subtitle ? `${title}, ${subtitle}` : title;

    const cardContent = (
      <>
        {image && (
          <Image
            source={imageSource}
            style={styles.image}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
        )}
        <View style={[styles.content, !image && styles.contentNoPadding]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
          {children && <View style={styles.children}>{children}</View>}
        </View>
      </>
    );

    if (isClickable) {
      return (
        <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
          <TouchableOpacity
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            testID={testID}
            style={[
              styles.card,
              { backgroundColor: colors.card },
              Platform.OS === 'ios' ? styles.shadowIOS : styles.shadowAndroid,
            ]}
          >
            {cardContent}
          </TouchableOpacity>
        </Animated.View>
      );
    }

    return (
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card },
          Platform.OS === 'ios' ? styles.shadowIOS : styles.shadowAndroid,
          style,
        ]}
        testID={testID}
      >
        {cardContent}
      </View>
    );
  }
);

Card.displayName = 'Card';

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  content: {
    padding: 16,
  },
  contentNoPadding: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  children: {
    marginTop: 12,
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
