/**
 * @fileoverview Root Navigator - Main navigation coordinator with authentication and onboarding gates
 * @purpose Manages top-level navigation flow based on auth state and onboarding completion
 * @inputs Authentication state, onboarding completion status
 * @outputs Appropriate navigation stack (Onboarding, Auth, or Main)
 *
 * TODO: Add deep linking configuration for shared routes
 * TODO: Implement navigation state persistence for better UX
 * TODO: Add loading screens with skeleton layouts
 * TODO: Add error boundaries for navigation failures
 */

import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useThemeColors } from '../contexts';
import { useAuth } from '../contexts/auth/AuthContext';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import { ThemeDemoScreen } from '../screens';

const Stack = createStackNavigator();

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
    >
      <Stack.Navigator
        initialRouteName={getInitialStack()}
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.background },
        }}
      >
        {/* Onboarding Stack */}
        {!hasSeenOnboarding && (
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{
              animationTypeForReplace: 'push',
            }}
          />
        )}

        {/* Authentication Stack */}
        {!isLoggedIn && hasSeenOnboarding && (
          <Stack.Screen
            name="Auth"
            component={LoginScreen}
            options={{
              animationTypeForReplace: 'push',
            }}
          />
        )}

        {/* Main App Stack */}
        {isLoggedIn && (
          <>
            <Stack.Screen
              name="Main"
              component={HomeScreen}
              options={{
                animationTypeForReplace: 'push',
              }}
            />

            {/* Additional screens accessible when logged in */}
            <Stack.Screen
              name="ThemeDemo"
              component={ThemeDemoScreen}
              options={{
                title: 'Theme Demo',
                headerShown: true,
                headerStyle: { backgroundColor: colors.card },
                headerTintColor: colors.textPrimary,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
