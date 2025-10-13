/**
 * @fileoverview Main Tabs Navigator - Bottom tab navigation for main app experience
 * @purpose Provides bottom tab navigation with Home, Explore, Safety, News, Profile tabs
 * @inputs User authentication state, current tab selection
 * @outputs Bottom tab navigation with theme-aware icons and active states
 *
 * TODO: Add badge notifications on tabs (e.g., unread news count)
 * TODO: Implement tab press animations
 * TODO: Add haptic feedback on tab switches
 * TODO: Optimize tab bar for tablet layouts
 */

import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useThemeColors } from '../contexts';
import type {
  MainTabParamList,
  HomeStackParamList,
  ExploreStackParamList,
  SafetyStackParamList,
  NewsStackParamList,
  ProfileStackParamList,
} from './types';

// Import screens
import {
  HomeScreen,
  ExploreScreen,
  SafetyScreen,
  NewsScreen,
  ProfileScreen,
} from '../screens';

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();
const ExploreStack = createStackNavigator<ExploreStackParamList>();
const SafetyStack = createStackNavigator<SafetyStackParamList>();
const NewsStack = createStackNavigator<NewsStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();

/**
 * Home Tab Stack Navigator
 * Contains Home screen and related nested screens
 */
function HomeStackNavigator() {
  const colors = useThemeColors();

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <HomeStack.Screen name="Home" component={HomeScreen} />
    </HomeStack.Navigator>
  );
}

/**
 * Explore Tab Stack Navigator
 * Contains Explore screen and related nested screens
 */
function ExploreStackNavigator() {
  const colors = useThemeColors();

  return (
    <ExploreStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
      }}
      initialRouteName="Explore"
    >
      <ExploreStack.Screen
        name="Explore"
        component={ExploreScreen}
        initialParams={{}}
      />
    </ExploreStack.Navigator>
  );
}

/**
 * Safety Tab Stack Navigator
 * Contains Safety screen and related nested screens
 */
function SafetyStackNavigator() {
  const colors = useThemeColors();

  return (
    <SafetyStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <SafetyStack.Screen name="Safety" component={SafetyScreen} />
    </SafetyStack.Navigator>
  );
}

/**
 * News Tab Stack Navigator
 * Contains News screen and related nested screens
 */
function NewsStackNavigator() {
  const colors = useThemeColors();

  return (
    <NewsStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
      }}
      initialRouteName="News"
    >
      <NewsStack.Screen name="News" component={NewsScreen} initialParams={{}} />
    </NewsStack.Navigator>
  );
}

/**
 * Profile Tab Stack Navigator
 * Contains Profile screen and related nested screens
 */
function ProfileStackNavigator() {
  const colors = useThemeColors();

  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
      }}
      initialRouteName="Profile"
    >
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{}}
      />
    </ProfileStack.Navigator>
  );
}

/**
 * Main Bottom Tab Navigator
 * Primary navigation interface with 5 tabs
 */
export default function MainTabs() {
  const colors = useThemeColors();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="🏠" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ExploreTab"
        component={ExploreStackNavigator}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="🌍" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="SafetyTab"
        component={SafetyStackNavigator}
        options={{
          tabBarLabel: 'Safety',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="🛡️" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="NewsTab"
        component={NewsStackNavigator}
        options={{
          tabBarLabel: 'News',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="📰" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="👤" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * Tab Icon Component
 * Renders emoji icons with theme-aware coloring
 * TODO: Replace with proper icon library (e.g., @expo/vector-icons)
 */
function TabIcon({
  icon,
  size,
}: {
  icon: string;
  color: string;
  size: number;
}) {
  return <Text style={{ fontSize: size + 4 }}>{icon}</Text>;
}
