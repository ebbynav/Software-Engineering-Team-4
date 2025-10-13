/**
 * @fileoverview Avatar - User profile picture with initials fallback
 * @purpose Displays user avatars with consistent styling across the app
 *
 * COMPONENT CONTRACT:
 *
 * Props:
 * - src?: string | number - Image URL or local require() asset
 * - initials: string - Fallback text when no image (1-2 characters)
 * - size?: number - Avatar diameter in pixels (default: 40)
 * - style?: ViewStyle - Additional custom styles
 * - onPress?: () => void - Optional press handler
 * - testID?: string - Testing identifier
 *
 * Visual Specifications:
 * - Shape: Perfect circle
 * - Border: 2px solid white (iOS), none (Android)
 * - Sizes: Small (32), Medium (40), Large (64), XL (96)
 * - Fallback: Colored background with white initials
 * - Background colors: Deterministic based on initials hash
 * - Image: ResizeMode.cover, circular clip
 *
 * Behavior:
 * - Shows image if src provided and loads successfully
 * - Falls back to initials on error or no src
 * - Initials are uppercased and truncated to 2 chars
 * - Background color is consistent for same initials
 * - Optional press handler makes it tappable
 *
 * Accessibility:
 * - accessibilityRole="image" or "button" if pressable
 * - accessibilityLabel describes user or action
 * - Image has accessibilityIgnoresInvertColors
 *
 * EXAMPLE USAGE:
 * ```tsx
 * // Basic avatar with image
 * <Avatar
 *   src="https://example.com/avatar.jpg"
 *   initials="JD"
 * />
 *
 * // Fallback initials only
 * <Avatar
 *   initials="AB"
 *   size={64}
 * />
 *
 * // Clickable avatar
 * <Avatar
 *   src={user.avatarUrl}
 *   initials={user.initials}
 *   onPress={() => navigateToProfile(user.id)}
 * />
 *
 * // Different sizes
 * <Avatar initials="SM" size={32} /> // Small
 * <Avatar initials="MD" size={40} /> // Medium (default)
 * <Avatar initials="LG" size={64} /> // Large
 * <Avatar initials="XL" size={96} /> // Extra Large
 * ```
 *
 * TODO: Add online status indicator
 * TODO: Support group avatars (multiple overlapping)
 * TODO: Add image loading state
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Platform,
  ImageSourcePropType,
} from 'react-native';

interface AvatarProps {
  src?: string | ImageSourcePropType;
  initials: string;
  size?: number;
  style?: ViewStyle;
  onPress?: () => void;
  testID?: string;
}

// Generate consistent color from string
const getColorFromString = (str: string): string => {
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E2',
    '#F8B195',
    '#C06C84',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index] || '#6C63FF';
};

export const Avatar = React.memo<AvatarProps>(
  ({ src, initials, size = 40, style, onPress, testID }) => {
    const [imageError, setImageError] = useState(false);

    const displayInitials = initials.toUpperCase().slice(0, 2);
    const backgroundColor = getColorFromString(initials);
    const showImage = src && !imageError;

    const imageSource =
      typeof src === 'string' ? { uri: src } : (src as ImageSourcePropType);

    const fontSize = size * 0.4;
    const borderWidth = Platform.OS === 'ios' ? 2 : 0;

    const avatarContent = (
      <View
        style={[
          styles.container,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: showImage ? 'transparent' : backgroundColor,
            borderWidth,
            borderColor: '#FFFFFF',
          },
          style,
        ]}
      >
        {showImage ? (
          <Image
            source={imageSource}
            style={[
              styles.image,
              {
                width: size - borderWidth * 2,
                height: size - borderWidth * 2,
                borderRadius: (size - borderWidth * 2) / 2,
              },
            ]}
            onError={() => setImageError(true)}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
        ) : (
          <Text style={[styles.initials, { fontSize }]}>{displayInitials}</Text>
        )}
      </View>
    );

    if (onPress) {
      return (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`Avatar for ${initials}`}
          testID={testID}
        >
          {avatarContent}
        </TouchableOpacity>
      );
    }

    return avatarContent;
  }
);

Avatar.displayName = 'Avatar';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
});
