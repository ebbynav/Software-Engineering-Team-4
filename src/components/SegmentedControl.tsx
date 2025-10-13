/**
 * SegmentedControl Component
 *
 * A tab switcher with animated underline indicator.
 *
 * VISUAL SPECIFICATIONS:
 * - Height: 48px
 * - Segments equally spaced
 * - Active text: primary color, weight 600
 * - Inactive text: textSecondary color
 * - Underline: 3px height, primary color, rounded caps
 * - Animation: spring with tension 100, friction 10
 *
 * BEHAVIOR:
 * - Animated underline slides between segments
 * - Tapping segment calls onChange with index
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutChangeEvent,
} from 'react-native';
import { useThemeColors } from '../contexts/theme/ThemeContext';

interface SegmentedControlProps {
  /** Array of segment labels */
  segments: string[];
  /** Currently selected index */
  selectedIndex: number;
  /** Change handler */
  onChange: (index: number) => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = React.memo(
  ({ segments, selectedIndex, onChange }) => {
    const colors = useThemeColors();
    const underlinePosition = useRef(new Animated.Value(0)).current;
    const segmentWidths = useRef<number[]>([]);
    const segmentPositions = useRef<number[]>([]);

    const handleSegmentLayout = (index: number, event: LayoutChangeEvent) => {
      const { width, x } = event.nativeEvent.layout;
      segmentWidths.current[index] = width;
      segmentPositions.current[index] = x;

      // Animate to selected position after layout
      if (
        index === selectedIndex &&
        segmentPositions.current[selectedIndex] !== undefined
      ) {
        underlinePosition.setValue(segmentPositions.current[selectedIndex]);
      }
    };

    useEffect(() => {
      if (segmentPositions.current[selectedIndex] !== undefined) {
        Animated.spring(underlinePosition, {
          toValue: segmentPositions.current[selectedIndex],
          useNativeDriver: true,
          tension: 100,
          friction: 10,
        }).start();
      }
    }, [selectedIndex]);

    return (
      <View style={styles.container}>
        <View style={styles.segmentsContainer}>
          {segments.map((segment, index) => (
            <TouchableOpacity
              key={index}
              style={styles.segment}
              onPress={() => onChange(index)}
              onLayout={event => handleSegmentLayout(index, event)}
              accessibilityRole="tab"
              accessibilityState={{ selected: index === selectedIndex }}
              accessibilityLabel={segment}
            >
              <Text
                style={[
                  styles.segmentText,
                  {
                    color:
                      index === selectedIndex
                        ? colors.primary
                        : colors.textSecondary,
                    fontWeight: index === selectedIndex ? '600' : '400',
                  },
                ]}
              >
                {segment}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Animated.View
          style={[
            styles.underline,
            {
              backgroundColor: colors.primary,
              width: segmentWidths.current[selectedIndex] || 0,
              transform: [{ translateX: underlinePosition }],
            },
          ]}
        />
      </View>
    );
  }
);

SegmentedControl.displayName = 'SegmentedControl';

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  segmentsContainer: {
    flexDirection: 'row',
    height: 48,
  },
  segment: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentText: {
    fontSize: 16,
  },
  underline: {
    height: 3,
    borderRadius: 1.5,
  },
});
