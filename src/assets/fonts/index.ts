/**
 * @fileoverview Font Assets - Custom font files and font family configurations
 * @purpose Manages custom font loading and provides font family constants
 * @inputs None (static font files - TTF, OTF)
 * @outputs Font family names and loading configurations
 *
 * TODO: Add SF Pro font files for iOS 17/26 design language
 * TODO: Configure expo-font loading for custom fonts
 * TODO: Add font weight variants (Light, Regular, Medium, Bold)
 */

// Font family constants matching Tailwind config
export const FONT_FAMILIES = {
  SF_PRO: 'SF Pro Text',
  SF_PRO_DISPLAY: 'SF Pro Display',
  SYSTEM: 'System',
} as const;

// Placeholder for font loading configuration
export const customFonts = {
  // Will be populated when font files are added
  // 'sf-pro-light': require('./SF-Pro-Text-Light.ttf'),
  // 'sf-pro-regular': require('./SF-Pro-Text-Regular.ttf'),
  // 'sf-pro-medium': require('./SF-Pro-Text-Medium.ttf'),
  // 'sf-pro-bold': require('./SF-Pro-Text-Bold.ttf'),
};
