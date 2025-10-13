/**
 * @fileoverview Root Navigator - Main navigation coordinator with authentication and onboarding gates
 * @purpose Manages top-level navigation flow based on auth state and onboarding completion
 * @inputs Authentication state, onboarding completion status
 * @outputs Appropriate navigation stack (Onboarding, Auth, or Main)
 *
 * Deep Linking Patterns:
 * - waytrove://route/:routeId - Opens route details
 * - waytrove://news/:newsId - Opens news article
 * - waytrove://safety/:guideId - Opens safety guide
 * - waytrove://profile/:userId - Opens user profile
 *
 * TODO: Implement navigation state persistence for better UX
 * TODO: Add loading screens with skeleton layouts
 * TODO: Add error boundaries for navigation failures
 */

import React from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useThemeColors } from '../contexts';
import { useAuth } from '../contexts/auth/AuthContext';
import type { RootStackParamList } from './types';

// Import screens
import {
  OnboardingScreen,
  LoginScreen,
  ThemeDemoScreen,
  RouteDetailsScreen,
  SettingsScreen,
} from '../screens';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

// Import navigators
import MainTabs from './MainTabs';

const Stack = createStackNavigator<RootStackParamList>();
export default function RootNavigator() {
  const colors = useThemeColors();
  const { isLoggedIn, hasSeenOnboarding, isLoading } = useAuth();

  // Show loading spinner during auth initialization
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Determine which stack to show based on state
  const getInitialStack = () => {
    if (!hasSeenOnboarding) {
      return 'Onboarding';
    }
    if (!isLoggedIn) {
      return 'Auth';
    }
    return 'Main';
  };

  return (
    <NavigationContainer
      theme={{
        dark: false, // We handle theming manually
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.card,
          text: colors.textPrimary,
          border: colors.border,
          notification: colors.error,
        },
      }}
      linking={{
        prefixes: ['waytrove://', 'https://waytrove.com'],
        config: {
          screens: {
            Onboarding: 'onboarding',
            Auth: 'auth',
            Main: 'main',
            RouteDetails: 'route/:routeId',
            Settings: 'settings',
            ThemeDemo: 'theme-demo',
          },
        },
      }}
    >
      <Stack.Navigator
        initialRouteName={getInitialStack()}
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.background },
        }}
      >
        {/* Onboarding Stack - Only shown on first launch */}
        {!hasSeenOnboarding && (
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{
              animationTypeForReplace: 'push',
              gestureEnabled: false, // Prevent swipe back
            }}
          />
        )}

        {/* Authentication Stack - Shown when not logged in */}
        {!isLoggedIn && hasSeenOnboarding && (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                animationTypeForReplace: 'push',
                gestureEnabled: false, // Prevent swipe back
              }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
              options={{
                headerShown: true,
                headerTitle: '',
                headerStyle: { backgroundColor: colors.background },
                headerTintColor: colors.textPrimary,
                headerShadowVisible: false,
              }}
            />
          </>
        )}

        {/* Main App Stack - Shown when logged in */}
        {isLoggedIn && (
          <>
            <Stack.Screen
              name="Main"
              component={MainTabs}
              options={{
                animationTypeForReplace: 'push',
              }}
            />

            {/* Modal Screens - Accessible from anywhere in the app */}
            <Stack.Screen
              name="RouteDetails"
              component={RouteDetailsScreen}
              options={{
                presentation: Platform.OS === 'ios' ? 'modal' : 'card',
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                presentation: Platform.OS === 'ios' ? 'modal' : 'card',
                headerShown: false,
              }}
            />

            {/* Theme Demo - Development only */}
            <Stack.Screen
              name="ThemeDemo"
              component={ThemeDemoScreen}
              options={{
                title: 'Theme Demo',
                headerShown: true,
                headerStyle: { backgroundColor: colors.card },
                headerTintColor: colors.textPrimary,
                presentation: Platform.OS === 'ios' ? 'modal' : 'card',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
