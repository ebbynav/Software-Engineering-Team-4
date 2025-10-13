/**
 * @fileoverview Mock Data - Development and testing data placeholders
 * @purpose Provides realistic mock data for development and testing before backend integration
 * @inputs None (static JSON data)
 * @outputs Mock data objects matching API response shapes
 *
 * TODO: Create mock data matching Django REST API response formats
 * TODO: Add mock user profiles, destinations, routes, safety alerts
 * TODO: Ensure mock data follows TypeScript types from src/types
 */

// Import types when available
// import type { User, Route, Post, SafetyAlert } from '../../types';

// Mock Users - TODO: Add realistic mock user data
export const mockUsers: any[] = [
  // Will be populated with realistic mock user data
];

// Mock Routes/Destinations - TODO: Add realistic travel route data
export const mockRoutes: any[] = [
  // Will be populated with realistic travel route data
];

// Mock Posts/Content - TODO: Add realistic travel post data
export const mockPosts: any[] = [
  // Will be populated with realistic travel post data
];

// Mock Safety Alerts - TODO: Add realistic safety alert data
export const mockSafetyAlerts: any[] = [
  // Will be populated with realistic safety alert data
];

export const mockData = {
  users: mockUsers,
  routes: mockRoutes,
  posts: mockPosts,
  safetyAlerts: mockSafetyAlerts,
};
