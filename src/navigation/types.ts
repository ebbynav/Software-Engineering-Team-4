/**
 * @fileoverview Navigation Type Definitions - Typed route parameter lists for type-safe navigation
 * @purpose Provides complete TypeScript type coverage for all navigation routes and params
 * @inputs Route parameters for each screen
 * @outputs Type definitions for navigation props and route params
 *
 * Deep Linking Patterns:
 * - waytrove://route/:routeId - Opens route details screen
 * - waytrove://news/:newsId - Opens news article details
 * - waytrove://safety/:safetyGuideId - Opens safety guide
 * - waytrove://profile/:userId - Opens user profile
 * - waytrove://explore?city=:cityName - Opens explore with city filter
 *
 * TODO: Configure React Navigation deep linking configuration
 * TODO: Add URL parameter validation and error handling
 * TODO: Implement universal links for iOS (apple-app-site-association)
 * TODO: Implement app links for Android (assetlinks.json)
 */

import type { NavigatorScreenParams } from '@react-navigation/native';

/**
 * Root Stack Parameter List
 * Top-level navigation stack containing all major navigation flows
 */
export type RootStackParamList = {
  // Onboarding flow - shown only on first app launch
  Onboarding: undefined;

  // Authentication screens - shown when user is not logged in
  Login: undefined;
  ForgotPassword: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;

  // Main app flow - shown when user is logged in
  Main: NavigatorScreenParams<MainTabParamList>;

  // Modal screens accessible from anywhere in the app
  // These use modal presentation (slide up from bottom on iOS)
  RouteDetails: {
    routeId: string;
    initialWaypointIndex?: number;
    source?: 'explore' | 'home' | 'profile' | 'notification';
  };

  NewsDetails: {
    newsId: string;
    category?: 'safety' | 'travel' | 'local' | 'general';
  };

  SafeRoute: {
    originLat: number;
    originLng: number;
    originName?: string;
    destinationLat: number;
    destinationLng: number;
    destinationName?: string;
    transportMode?: 'walking' | 'transit' | 'driving';
  };

  CreatePostModal: {
    routeId?: string; // Optional - if sharing a specific route
    prefilledText?: string;
  };

  Settings: undefined;

  // Theme demo screen (kept for development)
  ThemeDemo: undefined;
};

/**
 * Authentication Stack Parameter List
 * Handles all authentication-related screens
 */
export type AuthStackParamList = {
  Login: {
    redirectTo?: keyof RootStackParamList; // Where to go after successful login
  };

  Register: {
    email?: string; // Pre-filled email from social login
    name?: string; // Pre-filled name from social login
  };

  ForgotPassword: undefined;

  ResetPassword: {
    token: string; // Password reset token from email
  };
};

/**
 * Main Tab Parameter List
 * Bottom tab navigation for the main app experience
 * Each tab can have its own nested stack navigator
 */
export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  ExploreTab: NavigatorScreenParams<ExploreStackParamList>;
  SafetyTab: NavigatorScreenParams<SafetyStackParamList>;
  NewsTab: NavigatorScreenParams<NewsStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

/**
 * Home Stack Parameter List
 * Nested stack within the Home tab
 */
export type HomeStackParamList = {
  Home: undefined;

  // Additional home-related screens
  SavedRoutes: {
    filter?: 'recent' | 'favorites' | 'planned';
  };
};

/**
 * Explore Stack Parameter List
 * Nested stack within the Explore tab
 */
export type ExploreStackParamList = {
  Explore: {
    initialCity?: string;
    initialCategory?: 'restaurants' | 'attractions' | 'nightlife' | 'outdoor';
  };

  CityDetails: {
    cityId: string;
    cityName: string;
  };

  PlaceDetails: {
    placeId: string;
    placeName: string;
    city: string;
  };
};

/**
 * Safety Stack Parameter List
 * Nested stack within the Safety tab
 */
export type SafetyStackParamList = {
  Safety: undefined;

  SafetyGuide: {
    guideId: string;
    guideTitle: string;
    city?: string;
  };

  EmergencyContacts: {
    city: string;
    country: string;
  };
};

/**
 * News Stack Parameter List
 * Nested stack within the News tab
 */
export type NewsStackParamList = {
  News: {
    initialCategory?: 'safety' | 'travel' | 'local' | 'general';
  };

  NewsByCategory: {
    category: 'safety' | 'travel' | 'local' | 'general';
  };
};

/**
 * Profile Stack Parameter List
 * Nested stack within the Profile tab
 */
export type ProfileStackParamList = {
  Profile: {
    userId?: string; // View another user's profile
  };

  EditProfile: undefined;

  MyRoutes: {
    filter?: 'created' | 'completed' | 'saved';
  };

  Preferences: undefined;

  About: undefined;
};

/**
 * Type helper for navigation props
 * Usage: type Props = NavigationProps<RootStackParamList, 'RouteDetails'>;
 * TODO: Replace with proper navigation types from @react-navigation/native
 */
export type NavigationProps<
  ParamList extends Record<string, unknown>,
  RouteName extends keyof ParamList,
> = {
  navigation: Record<string, unknown>;
  route: {
    key: string;
    name: RouteName;
    params: ParamList[RouteName];
  };
};

/**
 * Deep Linking Configuration Types
 * These define the URL patterns for deep linking
 * TODO: Replace with proper linking types from @react-navigation/native
 */
export type DeepLinkConfig = {
  prefixes: string[]; // ['waytrove://', 'https://waytrove.com']
  config: {
    screens: {
      [K in keyof RootStackParamList]:
        | string
        | {
            path: string;
            parse?: Record<
              string,
              (value: string) => string | number | boolean
            >;
          };
    };
  };
};
