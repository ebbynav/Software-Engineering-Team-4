/**
 * @fileoverview Core TypeScript Types - Central type definitions for WayTrove app
 * @purpose Defines primary data structures and navigation types for type safety across the app
 * @inputs None (type definitions only)
 * @outputs TypeScript interfaces and types for core app entities
 *
 * TODO: Ensure types match Django REST API response schemas
 * TODO: Add validation schemas using libraries like Yup or Zod
 * TODO: Update types as API contracts are finalized with backend team
 */

// Navigation Types
export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Bookmarks: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  Tabs: undefined;
  DestinationDetails: { destinationId: string };
  RouteDetails: { routeId: string };
  Settings: undefined;
  EditProfile: undefined;
};

// Core Entity Types

/**
 * User - Represents a user account in the WayTrove system
 * Used for authentication, profile management, and personalization
 */
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string; // URL to profile image
  bio?: string;
  location?: string;
  preferences: {
    units: 'metric' | 'imperial'; // Distance/temperature units
    language: string; // ISO language code
    notifications: {
      safetyAlerts: boolean;
      routeUpdates: boolean;
      socialActivity: boolean;
    };
  };
  stats: {
    routesCompleted: number;
    totalDistance: number; // in kilometers
    countriesVisited: number;
  };
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * Route - Represents a travel route or destination
 * Core entity for travel planning and discovery features
 */
export interface Route {
  id: string;
  title: string;
  description: string;
  images: string[]; // Array of image URLs
  location: {
    name: string; // Human-readable location name
    coordinates: {
      latitude: number;
      longitude: number;
    };
    country: string;
    region?: string;
  };
  difficulty: 'easy' | 'moderate' | 'challenging' | 'extreme';
  duration: {
    estimated: number; // in hours
    unit: 'hours' | 'days';
  };
  distance?: number; // in kilometers
  activities: string[]; // hiking, photography, cultural, adventure, etc.
  tags: string[]; // nature, urban, historical, family-friendly, etc.
  rating: {
    average: number; // 1-5 stars
    count: number; // number of reviews
  };
  safety: {
    level: 'low' | 'medium' | 'high'; // risk level
    lastUpdated: string; // ISO date string
    alerts: string[]; // current safety concerns
  };
  creator: {
    id: string;
    username: string;
    avatar?: string;
  };
  isBookmarked?: boolean; // user-specific field
  createdAt: string;
  updatedAt: string;
}

/**
 * Post - Represents user-generated content about travel experiences
 * Used for social features, reviews, and travel inspiration
 */
export interface Post {
  id: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  content: {
    title: string;
    body: string;
    images: string[]; // Array of image URLs
    tags: string[];
  };
  route?: {
    id: string;
    title: string;
  }; // Optional associated route
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  location?: {
    name: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  isLiked?: boolean; // user-specific field
  createdAt: string;
  updatedAt: string;
}

/**
 * SafetyAlert - Represents safety warnings and travel advisories
 * Critical for user safety and informed travel decision-making
 */
export interface SafetyAlert {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'danger' | 'critical';
  type:
    | 'weather'
    | 'political'
    | 'health'
    | 'natural_disaster'
    | 'security'
    | 'transportation';
  location: {
    name: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    radius?: number; // affected radius in kilometers
    country: string;
    regions?: string[]; // specific regions/states affected
  };
  validFrom: string; // ISO date string
  validUntil?: string; // ISO date string - null for indefinite
  source: {
    name: string; // Government agency, news outlet, etc.
    url?: string; // Link to original alert
  };
  recommendations: string[]; // Specific advice for travelers
  affectedRoutes?: string[]; // Route IDs that may be impacted
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string | number;
  details?: unknown;
}

// Authentication Types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string; // ISO date string
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
