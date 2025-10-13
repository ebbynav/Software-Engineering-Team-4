/**
 * @fileoverview Auth Context - Authentication state management with mock sign-in flows
 * @purpose Provides authentication state, user management, and mock social login methods
 * @inputs Sign-in credentials, user data, authentication tokens
 * @outputs Auth state, user object, sign-in/sign-out methods
 *
 * TODO: Replace mock authentication with expo-auth-session flows
 * TODO: Connect to Django REST API authentication endpoints (/auth/login, /auth/register)
 * TODO: Implement secure token storage using expo-secure-store
 * TODO: Add biometric authentication support
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../utils/constants';

// User object structure as specified
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  city?: string;
  interests: string[];
}

// Sign-in method types
export type SignInMethod = 'google' | 'apple' | 'email';

// Sign-in payloads
export interface EmailSignInPayload {
  email: string;
  password: string;
}

export interface SocialSignInPayload {
  // These would be populated by actual OAuth flows
  token?: string;
  userInfo?: Record<string, unknown>;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  city?: string;
  interests?: string[];
}

// Auth context interface
interface AuthContextType {
  // User state
  user: User | null;
  isLoggedIn: boolean;

  // Authentication methods
  signInMock: (
    method: SignInMethod,
    payload: EmailSignInPayload | SocialSignInPayload
  ) => Promise<void>;
  signUpMock: (payload: SignUpPayload) => Promise<void>;
  signOut: () => Promise<void>;

  // Onboarding state
  hasSeenOnboarding: boolean;
  markOnboardingComplete: () => Promise<void>;

  // Loading states
  isLoading: boolean;
  isAuthenticating: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Initialize auth state from AsyncStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check authentication status
        const authData = await AsyncStorage.getItem(STORAGE_KEYS.AUTH);
        if (authData) {
          // User is logged in, but we only store the flag
          // User object is kept in memory only for this mock phase
          // TODO: In production, validate token with backend and fetch fresh user data
          setUser(getMockUser('returning')); // Mock returning user
        }

        // Check onboarding status
        const onboardingData = await AsyncStorage.getItem(
          STORAGE_KEYS.HAS_SEEN_ONBOARDING
        );
        setHasSeenOnboarding(onboardingData === 'true');
      } catch (error) {
        console.warn('Failed to initialize auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Mock user data generator
  const getMockUser = (
    type: 'google' | 'apple' | 'email' | 'returning' = 'email'
  ): User => {
    const mockUsers = {
      google: {
        id: 'google_123456',
        name: 'Alex Johnson',
        email: 'alex.johnson@gmail.com',
        avatarUrl: 'https://lh3.googleusercontent.com/a/default-user',
        city: 'San Francisco',
        interests: ['hiking', 'photography', 'travel', 'food'],
      },
      apple: {
        id: 'apple_789012',
        name: 'Sam Chen',
        email: 'sam.chen@icloud.com',
        avatarUrl: undefined, // Apple often doesn't provide avatar
        city: 'New York',
        interests: ['architecture', 'art', 'cycling', 'coffee'],
      },
      email: {
        id: 'email_345678',
        name: 'Jordan Rivera',
        email: 'jordan.rivera@example.com',
        avatarUrl: undefined,
        city: 'Austin',
        interests: ['music', 'outdoor', 'tech', 'adventure'],
      },
      returning: {
        id: 'user_999999',
        name: 'Taylor Smith',
        email: 'taylor.smith@example.com',
        avatarUrl:
          'https://ui-avatars.com/api/?name=Taylor+Smith&background=6C63FF&color=fff',
        city: 'Seattle',
        interests: [
          'nature',
          'backpacking',
          'sustainable travel',
          'local culture',
        ],
      },
    };

    return mockUsers[type];
  };

  // Mock sign-in method
  const signInMock = async (
    method: SignInMethod,
    payload: EmailSignInPayload | SocialSignInPayload
  ): Promise<void> => {
    setIsAuthenticating(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // TODO: Replace with actual authentication flows:
      //
      // For Google Sign-In:
      // - Use expo-auth-session with Google OAuth2
      // - POST to Django endpoint: /auth/google-signin
      // - Expected response: { user: User, accessToken: string, refreshToken: string }
      //
      // For Apple Sign-In:
      // - Use expo-apple-authentication
      // - POST to Django endpoint: /auth/apple-signin
      // - Expected response: { user: User, accessToken: string, refreshToken: string }
      //
      // For Email Sign-In:
      // - POST to Django endpoint: /auth/login
      // - Payload: { email: string, password: string }
      // - Expected response: { user: User, accessToken: string, refreshToken: string }

      if (method === 'email') {
        const emailPayload = payload as EmailSignInPayload;
        // Basic email validation for mock
        if (!emailPayload.email || !emailPayload.password) {
          throw new Error('Email and password are required');
        }
        // TODO: Replace with actual API call
        console.log('Mock email sign-in:', emailPayload.email);
      }

      // Generate mock user based on sign-in method
      const mockUser = getMockUser(method);
      setUser(mockUser);

      // Persist auth flag (not user data for security)
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH, 'true');

      console.log(`Mock ${method} sign-in successful for:`, mockUser.name);
    } catch (error) {
      console.error('Sign-in failed:', error);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Mock sign-up method
  const signUpMock = async (payload: SignUpPayload): Promise<void> => {
    setIsAuthenticating(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // TODO: Replace with actual sign-up flow:
      // - POST to Django endpoint: /auth/register
      // - Payload: { name: string, email: string, password: string, city?: string, interests?: string[] }
      // - Expected response: { user: User, accessToken: string, refreshToken: string }
      // - Handle email verification flow if required

      // Basic validation for mock
      if (!payload.name || !payload.email || !payload.password) {
        throw new Error('Name, email, and password are required');
      }

      // Create mock user from sign-up data
      const newUser: User = {
        id: `signup_${Date.now()}`,
        name: payload.name,
        email: payload.email,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.name)}&background=6C63FF&color=fff`,
        city: payload.city,
        interests: payload.interests || [],
      };

      setUser(newUser);

      // Persist auth flag
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH, 'true');

      console.log('Mock sign-up successful for:', newUser.name);
    } catch (error) {
      console.error('Sign-up failed:', error);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Sign out method
  const signOut = async (): Promise<void> => {
    try {
      // TODO: Replace with actual sign-out flow:
      // - POST to Django endpoint: /auth/logout
      // - Clear stored tokens from secure storage
      // - Invalidate refresh tokens on server

      // Clear auth flag
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH);

      // Clear user from memory
      setUser(null);

      console.log('User signed out successfully');
    } catch (error) {
      console.error('Sign-out failed:', error);
      throw error;
    }
  };

  // Mark onboarding as complete
  const markOnboardingComplete = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING, 'true');
      setHasSeenOnboarding(true);
    } catch (error) {
      console.error('Failed to mark onboarding complete:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoggedIn: !!user,
    signInMock,
    signUpMock,
    signOut,
    hasSeenOnboarding,
    markOnboardingComplete,
    isLoading,
    isAuthenticating,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
