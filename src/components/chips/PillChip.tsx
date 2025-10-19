/**
 * @fileoverview PillChip - Small selectable chip/tag component
 * @purpose Provides filter chips, category tags, and selectable options
 *
 * COMPONENT CONTRACT:
 *
 * Props:
 * - label: string - Chip text content
 * - selected: boolean - Whether chip is in selected state
 * - onToggle: () => void - Handler called when chip is tapped
 * - style?: ViewStyle - Additional custom styles
 * - testID?: string - Testing identifier
 *
 * Visual Specifications:
 * - Shape: Pill (fully rounded)
 * - Height: 32px
 * - Padding: 12px horizontal
 * - Unselected: Transparent background, border (colors.border)
 * - Selected: Primary color stroke (2px), subtle primary fill (primary + '20')
 * - Text: 12px, semibold (600)
 * - Text color: textSecondary when unselected, primary when selected
 *
 * Behavior:
 * - Scale animation on toggle (1.0 → 1.05 → 1.0)
 * - Animated transition between selected/unselected (200ms)
 * - Haptic feedback on toggle
 *
 * Accessibility:
 * - accessibilityRole="button"
 * - accessibilityState includes selected state
 * - accessibilityLabel is the label prop
 *
 * EXAMPLE USAGE:
 * ```tsx
 * // Filter chips
 * <PillChip
 *   label="Restaurants"
 *   selected={selectedCategory === 'restaurants'}
 *   onToggle={() => setSelectedCategory('restaurants')}
 * />
 *
 * // Multiple selection
 * {categories.map(cat => (
 *   <PillChip
 *     key={cat}
 *     label={cat}
 *     selected={selectedCategories.includes(cat)}
 *     onToggle={() => toggleCategory(cat)}
 *   />
 * ))}
 * ```
 *
 * TODO: Add icon support
 * TODO: Add removable variant with X icon
 * TODO: Support disabled state
 */

import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, ViewStyle } from 'react-native';
import { useThemeColors } from '../../contexts';

interface PillChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
  style?: ViewStyle;
  testID?: string;
}

export const PillChip = React.memo<PillChipProps>(
  ({ label, selected, onToggle, style, testID }) => {
    const colors = useThemeColors();
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const backgroundAnim = useRef(new Animated.Value(selected ? 1 : 0)).current;

    useEffect(() => {
      Animated.timing(backgroundAnim, {
        toValue: selected ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }, [selected, backgroundAnim]);

    const handlePress = () => {
      // Bounce animation
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.05,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();

      onToggle();
    };

    const backgroundColor = backgroundAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['transparent', `${colors.primary}20`],
    });

    const borderColor = selected ? colors.primary : colors.border;
    const textColor = selected ? colors.primary : colors.textSecondary;

    return (
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityState={{ selected }}
          testID={testID}
        >
          <Animated.View
            style={[
              styles.chip,
              {
                backgroundColor,
                borderColor,
                borderWidth: selected ? 2 : 1,
              },
            ]}
          >
            <Text style={[styles.label, { color: textColor }]}>{label}</Text>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

PillChip.displayName = 'PillChip';

const styles = StyleSheet.create({
  chip: {
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
