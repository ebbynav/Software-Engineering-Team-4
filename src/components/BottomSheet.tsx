/**
 * BottomSheet Component
 *
 * A draggable modal sheet that slides up from the bottom of the screen with smooth animations.
 * Supports multiple snap points, gesture-based dragging, and backdrop blur effect.
 *
 * VISUAL SPECIFICATIONS:
 * - Slides up from bottom with spring animation
 * - Semi-transparent backdrop with blur effect (rgba(0,0,0,0.5))
 * - Rounded top corners (24px radius)
 * - Drag handle: 40px wide × 4px tall, centered, 12px from top
 * - Content padding: 24px horizontal, 16px below handle
 * - Shadow: iOS elevation 8, Android elevation 8
 *
 * BEHAVIOR:
 * - Snap points: Array of heights as percentages (e.g., [0.25, 0.5, 0.9])
 * - Drag gesture: Pan down to dismiss or snap to lower point
 * - Swipe velocity threshold: >0.5 to snap to next point
 * - Backdrop tap: Closes sheet
 * - Spring animation: stiffness 300, damping 30
 *
 * ACCESSIBILITY:
 * - accessibilityViewIsModal on sheet
 * - Backdrop has accessibilityLabel "Close"
 * - Keyboard dismiss on drag
 *
 * EXAMPLE USAGE:
 * ```tsx
 * <BottomSheet
 *   visible={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   snapPoints={[0.3, 0.6, 0.9]}
 *   initialSnapPoint={0.6}
 * >
 *   <Text>Sheet content here</Text>
 * </BottomSheet>
 * ```
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableOpacity,
  Animated,
  PanResponder,
  Platform,
  Keyboard,
} from 'react-native';
import { useThemeColors } from '../contexts/theme/ThemeContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomSheetProps {
  /** Whether the bottom sheet is visible */
  visible: boolean;
  /** Callback when sheet should close */
  onClose: () => void;
  /** Array of snap points as percentages of screen height (0-1) */
  snapPoints?: number[];
  /** Initial snap point index (default: last snap point) */
  initialSnapPoint?: number;
  /** Content to render inside the sheet */
  children: React.ReactNode;
  /** Whether to show the drag handle (default: true) */
  showHandle?: boolean;
  /** Whether backdrop is tappable to close (default: true) */
  backdropTappable?: boolean;
}

export const BottomSheet: React.FC<BottomSheetProps> = React.memo(
  ({
    visible,
    onClose,
    snapPoints = [0.5, 0.9],
    initialSnapPoint,
    children,
    showHandle = true,
    backdropTappable = true,
  }) => {
    const colors = useThemeColors();

    // Use the highest snap point as initial if not specified
    const initialIndex = initialSnapPoint ?? snapPoints.length - 1;
    const [currentSnapIndex, setCurrentSnapIndex] = useState(initialIndex);

    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;

    // Convert snap point percentage to actual Y position
    const getSnapPosition = (snapIndex: number): number => {
      const snapPercent = snapPoints[snapIndex] || 0.5;
      return SCREEN_HEIGHT * (1 - snapPercent);
    };

    // Pan responder for drag gestures
    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          // Only respond to vertical drags
          return Math.abs(gestureState.dy) > 10;
        },
        onPanResponderMove: (_, gestureState) => {
          const currentPosition = getSnapPosition(currentSnapIndex);
          const newPosition = currentPosition + gestureState.dy;

          // Don't allow dragging above the highest snap point
          const maxPosition = getSnapPosition(snapPoints.length - 1);
          if (newPosition >= maxPosition) {
            translateY.setValue(newPosition);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          const velocity = gestureState.vy;
          const currentPosition = getSnapPosition(currentSnapIndex);
          const newPosition = currentPosition + gestureState.dy;

          // Determine target snap point based on velocity and position
          let targetIndex = currentSnapIndex;

          if (velocity > 0.5) {
            // Fast swipe down - go to lower snap point or close
            if (currentSnapIndex === 0) {
              onClose();
              return;
            }
            targetIndex = currentSnapIndex - 1;
          } else if (velocity < -0.5) {
            // Fast swipe up - go to higher snap point
            if (currentSnapIndex < snapPoints.length - 1) {
              targetIndex = currentSnapIndex + 1;
            }
          } else {
            // Slow drag - find nearest snap point
            let minDistance = Infinity;
            snapPoints.forEach((_, index) => {
              const snapPos = getSnapPosition(index);
              const distance = Math.abs(newPosition - snapPos);
              if (distance < minDistance) {
                minDistance = distance;
                targetIndex = index;
              }
            });

            // If dragged significantly down from lowest snap point, close
            if (targetIndex === 0 && newPosition > getSnapPosition(0) + 100) {
              onClose();
              return;
            }
          }

          animateToSnapPoint(targetIndex);
        },
      })
    ).current;

    const animateToSnapPoint = (snapIndex: number) => {
      setCurrentSnapIndex(snapIndex);
      const targetPosition = getSnapPosition(snapIndex);

      Animated.spring(translateY, {
        toValue: targetPosition,
        useNativeDriver: true,
        stiffness: 300,
        damping: 30,
      }).start();
    };

    const animateIn = () => {
      const targetPosition = getSnapPosition(currentSnapIndex);

      Animated.parallel([
        Animated.spring(translateY, {
          toValue: targetPosition,
          useNativeDriver: true,
          stiffness: 300,
          damping: 30,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const animateOut = () => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    };

    useEffect(() => {
      if (visible) {
        animateIn();
      } else {
        animateOut();
      }
    }, [visible]);

    const handleBackdropPress = () => {
      if (backdropTappable) {
        Keyboard.dismiss();
        onClose();
      }
    };

    if (!visible) {
      return null;
    }

    return (
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={onClose}
        statusBarTranslucent
      >
        {/* Backdrop */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleBackdropPress}
          accessibilityLabel="Close"
          accessibilityRole="button"
        >
          <Animated.View
            style={[
              styles.backdropOverlay,
              {
                opacity: backdropOpacity,
              },
            ]}
          />
        </TouchableOpacity>

        {/* Sheet */}
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.card,
              transform: [{ translateY }],
            },
          ]}
          accessibilityViewIsModal
          {...panResponder.panHandlers}
        >
          {/* Drag Handle */}
          {showHandle && (
            <View style={styles.handleContainer}>
              <View
                style={[styles.handle, { backgroundColor: colors.border }]}
              />
            </View>
          )}

          {/* Content */}
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </Modal>
    );
  }
);

BottomSheet.displayName = 'BottomSheet';

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SCREEN_HEIGHT,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
});
