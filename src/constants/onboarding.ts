/**
 * @fileoverview Onboarding Data
 * @purpose Define onboarding slide content and configuration
 */

export interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  illustration: string; // Placeholder for now
  gradient?: {
    light: string[];
    dark: string[];
  };
}

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Discover Hidden Gems',
    description:
      'Explore authentic local routes and experiences shared by travelers worldwide.',
    illustration: '🗺️',
    gradient: {
      light: ['#4A90E2', '#50C9E9'],
      dark: ['#2D5A7B', '#2E7D8F'],
    },
  },
  {
    id: '2',
    title: 'Safety First',
    description:
      'Real-time safety alerts and community-verified information to keep you secure on your journey.',
    illustration: '🛡️',
    gradient: {
      light: ['#7B61FF', '#9D7FFF'],
      dark: ['#4A3A8F', '#5E4AA3'],
    },
  },
  {
    id: '3',
    title: 'Connect & Share',
    description:
      'Join a global community of travelers. Share your adventures and inspire others.',
    illustration: '🌍',
    gradient: {
      light: ['#FF6B6B', '#FF8E8E'],
      dark: ['#8F3A3A', '#A34A4A'],
    },
  },
];

export const ONBOARDING_STORAGE_KEY = '@waytrove_has_seen_onboarding';
