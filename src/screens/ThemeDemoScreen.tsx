/**
 * @fileoverview Theme Demo Screen - Demonstrates theme switching and design tokens
 * @purpose Shows all theme colors, components, and animated transitions in both light/dark modes
 * @inputs Navigation props from React Navigation
 * @outputs Interactive demo screen showcasing theme system capabilities
 *
 * TODO: Add more component examples (buttons, cards, inputs)
 * TODO: Add color palette display with hex values
 * TODO: Add performance metrics for theme switching
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useThemeColors } from '../contexts/theme/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { THEME_TRANSITION_DURATION } from '../contexts/theme/tokens';

export default function ThemeDemoScreen() {
  const { theme, isDark } = useTheme();
  const colors = useThemeColors();

  // Animation for theme transitions
  const [fadeAnim] = React.useState(new Animated.Value(1));
  const [slideAnim] = React.useState(new Animated.Value(0));

  // Animate when theme changes
  React.useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: THEME_TRANSITION_DURATION.BACKGROUND,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: THEME_TRANSITION_DURATION.COLORS,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(slideAnim, {
      toValue: isDark ? 1 : 0,
      duration: THEME_TRANSITION_DURATION.COLORS,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    }).start();
  }, [theme, fadeAnim, slideAnim, isDark]);

  const slideTransform = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });

  const ColorSwatch = ({
    label,
    color,
    textColor,
  }: {
    label: string;
    color: string;
    textColor?: string;
  }) => (
    <View style={[styles.colorSwatch, { backgroundColor: color }]}>
      <Text
        style={[styles.swatchLabel, { color: textColor || colors.textPrimary }]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.swatchValue,
          { color: textColor || colors.textSecondary },
        ]}
      >
        {color}
      </Text>
    </View>
  );

  const SampleCard = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <Animated.View
      style={[
        styles.sampleCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          transform: [{ translateY: slideTransform }],
        },
      ]}
    >
      <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
        {title}
      </Text>
      {children}
    </Animated.View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            WayTrove Theme Demo
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Current theme: {theme}
          </Text>
          <ThemeToggle size={28} style={styles.themeToggle} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Brand Colors */}
          <SampleCard title="Brand Colors">
            <View style={styles.colorGrid}>
              <ColorSwatch
                label="Primary"
                color={colors.primary}
                textColor={colors.textInverse}
              />
              <ColorSwatch
                label="Secondary"
                color={colors.secondary}
                textColor={colors.textInverse}
              />
              <ColorSwatch
                label="Accent"
                color={colors.accent}
                textColor={colors.textInverse}
              />
            </View>
          </SampleCard>

          {/* Status Colors */}
          <SampleCard title="Status Colors">
            <View style={styles.colorGrid}>
              <ColorSwatch
                label="Success"
                color={colors.success}
                textColor={colors.textInverse}
              />
              <ColorSwatch
                label="Warning"
                color={colors.warning}
                textColor={colors.textInverse}
              />
              <ColorSwatch
                label="Error"
                color={colors.error}
                textColor={colors.textInverse}
              />
              <ColorSwatch
                label="Info"
                color={colors.info}
                textColor={colors.textInverse}
              />
            </View>
          </SampleCard>

          {/* Typography */}
          <SampleCard title="Typography">
            <Text
              style={[styles.typographyPrimary, { color: colors.textPrimary }]}
            >
              Primary text with proper contrast
            </Text>
            <Text
              style={[
                styles.typographySecondary,
                { color: colors.textSecondary },
              ]}
            >
              Secondary text for descriptions and labels
            </Text>
            <Text
              style={[
                styles.typographyTertiary,
                { color: colors.textTertiary },
              ]}
            >
              Tertiary text for subtle information
            </Text>
          </SampleCard>

          {/* UI Elements */}
          <SampleCard title="UI Elements">
            <View style={styles.uiElements}>
              <View
                style={[
                  styles.sampleButton,
                  { backgroundColor: colors.buttonPrimary },
                ]}
              >
                <Text style={[styles.buttonText, { color: colors.buttonText }]}>
                  Primary Button
                </Text>
              </View>

              <View
                style={[
                  styles.sampleButton,
                  styles.secondaryButton,
                  {
                    backgroundColor: colors.buttonSecondary,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { color: colors.buttonTextSecondary },
                  ]}
                >
                  Secondary Button
                </Text>
              </View>

              <View
                style={[
                  styles.sampleInput,
                  {
                    backgroundColor: colors.backgroundSecondary,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[styles.inputPlaceholder, { color: colors.muted }]}
                >
                  Sample input field
                </Text>
              </View>
            </View>
          </SampleCard>

          {/* Elevation */}
          <SampleCard title="Elevation & Shadows">
            <View style={styles.elevationSamples}>
              <View
                style={[
                  styles.elevationCard,
                  {
                    backgroundColor: colors.elevation,
                    shadowColor: colors.shadow,
                  },
                ]}
              >
                <Text
                  style={[styles.elevationLabel, { color: colors.textPrimary }]}
                >
                  Low Elevation
                </Text>
              </View>

              <View
                style={[
                  styles.elevationCard,
                  styles.elevationHigh,
                  {
                    backgroundColor: colors.elevationLight,
                    shadowColor: colors.shadow,
                  },
                ]}
              >
                <Text
                  style={[styles.elevationLabel, { color: colors.textPrimary }]}
                >
                  High Elevation
                </Text>
              </View>
            </View>
          </SampleCard>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textTertiary }]}>
              All colors automatically adapt to the selected theme
            </Text>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  themeToggle: {
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sampleCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorSwatch: {
    flex: 1,
    minWidth: 80,
    height: 60,
    borderRadius: 8,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swatchLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  swatchValue: {
    fontSize: 10,
    opacity: 0.8,
  },
  typographyPrimary: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  typographySecondary: {
    fontSize: 14,
    marginBottom: 6,
  },
  typographyTertiary: {
    fontSize: 12,
  },
  uiElements: {
    gap: 12,
  },
  sampleButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButton: {
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  sampleInput: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  inputPlaceholder: {
    fontSize: 16,
  },
  elevationSamples: {
    flexDirection: 'row',
    gap: 16,
  },
  elevationCard: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  elevationHigh: {
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  elevationLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
