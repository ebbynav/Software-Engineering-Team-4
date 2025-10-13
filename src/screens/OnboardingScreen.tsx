/**
 * OnboardingScreen
 *
 * Three-slide carousel introducing WayTrove features with gradient backgrounds.
 *
 * VISUAL SPECIFICATIONS:
 * - Full screen slides with horizontal pagination
 * - Gradients that invert subtly in dark mode
 * - Illustration placeholder (emoji): 100px font size, centered
 * - Title: 32px, bold, 24px below illustration
 * - Description: 16px, centered, textSecondary, 16px below title
 * - Skip button: top-right, 16px from edges
 * - Next/Get Started: bottom-right, 24px from edges
 * - Pagination dots: centered bottom, 80px from bottom
 *
 * BEHAVIOR:
 * - Swipe or tap Next to advance
 * - Skip or Get Started persists @waytrove_has_seen_onboarding
 * - Navigate to Login after completion
 */

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useThemeColors, useIsDark } from '../contexts/theme/ThemeContext';
import {
  ONBOARDING_SLIDES,
  ONBOARDING_STORAGE_KEY,
} from '../constants/onboarding';
import { RootStackParamList } from '../types';
import { PrimaryButton } from '../components';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type OnboardingNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Onboarding'
>;

export default function OnboardingScreen() {
  const colors = useThemeColors();
  const isDark = useIsDark();
  const navigation = useNavigation<OnboardingNavigationProp>();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: SCREEN_WIDTH * (currentIndex + 1),
        animated: true,
      });
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
      navigation.replace('Login');
    } catch (error) {
      console.error('Failed to save onboarding completion:', error);
      navigation.replace('Login');
    }
  };

  const isLastSlide = currentIndex === ONBOARDING_SLIDES.length - 1;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Skip Button */}
      {!isLastSlide && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
        >
          <Text style={[styles.skipText, { color: colors.textSecondary }]}>
            Skip
          </Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {ONBOARDING_SLIDES.map(slide => (
          <View key={slide.id} style={styles.slide}>
            <LinearGradient
              colors={
                isDark
                  ? slide.gradient?.dark || [
                      colors.background,
                      colors.background,
                    ]
                  : slide.gradient?.light || [
                      colors.background,
                      colors.background,
                    ]
              }
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <View style={styles.content}>
                <Text style={styles.illustration}>{slide.illustration}</Text>
                <Text style={[styles.title, { color: colors.textPrimary }]}>
                  {slide.title}
                </Text>
                <Text
                  style={[styles.description, { color: colors.textSecondary }]}
                >
                  {slide.description}
                </Text>
              </View>
            </LinearGradient>
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {ONBOARDING_SLIDES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentIndex ? colors.primary : colors.border,
                width: index === currentIndex ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* Next / Get Started Button */}
      <View style={styles.buttonContainer}>
        <PrimaryButton
          label={isLastSlide ? 'Get Started' : 'Next'}
          onPress={handleNext}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  illustration: {
    fontSize: 100,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
  },
});
