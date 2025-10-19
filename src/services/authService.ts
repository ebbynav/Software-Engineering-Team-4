/**
 * @fileoverview Authentication Service
 * @purpose Handles user authentication, registration, and session management
 *
 * All functions return ApiResponse<T> from apiService
 */

// import { get, post, put } from './apiService';

/**
 * User object shape returned from authentication endpoints
 */
/**
 * Register a new user account
 *
 * @param email - User's email address
 * @param password - User's password (min 8 chars, must include uppercase, lowercase, number)
 * @param username - Unique username (3-20 chars, alphanumeric + underscore)
 * @param fullName - User's full name
 * @returns User object and authentication tokens
 *
 * TODO: Backend Integration
 * - Endpoint: POST /auth/register
 * - Request body: { email: string, password: string, username: string, fullName: string }
 * - Response: { error: false, message: "Registration successful", data: { user: User, tokens: AuthTokens } }
 * - Error codes:
 *   - 400: Validation error (weak password, invalid email, etc.)
 *   - 409: Email or username already exists
 * - Backend should send verification email
 * - Auto-login user after successful registration
 */
import { post } from './apiService';

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatar?: string;
  phoneNumber?: string;
  bio?: string;
  location?: {
    city: string;
    state: string;
    country: string;
  };
  safetyPreferences?: {
    shareLocation: boolean;
    emergencyContacts: string[];
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Authentication token response
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds until token expires
}

/**
 * Login with email and password
 *
 * @param email - User's email address
 * @param password - User's password
 * @returns User object and authentication tokens
 *
 * TODO: Backend Integration
 * - Endpoint: POST /auth/login
 * - Request body: { email: string, password: string }
 * - Response: { error: false, message: "Login successful", data: { user: User, tokens: AuthTokens } }
 * - Error codes:
 *   - 401: Invalid credentials
 *   - 404: User not found
 *   - 429: Too many login attempts
 * - Store tokens in secure storage (AsyncStorage/SecureStore)
 * - Store user object in global state/context
 */
export async function login(_email: string, _password: string) {
  try {
    const graphqlMutation = `mutation Login($input: LoginInput!) {\n  login(input: $input) {\n    user { id email username fullName }\n    tokens { accessToken refreshToken expiresIn }\n  }\n}`;

    const variables = { input: { email: _email, password: _password } };
    const res = await post('/graphql', { query: graphqlMutation, variables });
    // If calling GraphQL, our api wrapper returns an envelope: { error:false, message, data }
    // where data is the raw GraphQL response (e.g. { data: { login: { ... } } }).
    if (res && (res as any).data) {
      const gqlResp = (res as any).data as any;
      // Common shapes:
      // 1) gqlResp = { data: { login: { user, tokens } } }
      // 2) gqlResp = { login: { user, tokens } }
      const candidate = gqlResp?.data?.login ?? gqlResp?.login ?? gqlResp?.data ?? gqlResp;
      return candidate;
    }
    return res;
  } catch (err) {
    // Fallback to REST-style endpoint
    try {
      const res = await post('/auth/login', { email: _email, password: _password });
      // REST style might return envelope { error:false, message, data }
      return (res as any).data ?? res;
    } catch (err2) {
      throw err2;
    }
  }
}

export async function register(
  email: string,
  password: string,
  username: string,
  fullName: string
) {
  // Prefer GraphQL mutation if backend exposes /graphql
  try {
    const graphqlMutation = `mutation Register($input: RegisterInput!) {\n  register(input: $input) {\n    user { id email username fullName }\n    tokens { accessToken refreshToken expiresIn }\n  }\n}`;

    const variables = {
      input: {
        email,
        password,
        username,
        fullName,
      },
    };

    const res = await post('/graphql', { query: graphqlMutation, variables });
    if (res && (res as any).data) {
      const gqlResp = (res as any).data as any;
      const candidate = gqlResp?.data?.register ?? gqlResp?.register ?? gqlResp?.data ?? gqlResp;
      return candidate;
    }
    return res;
  } catch (err) {
    // Fallback to REST-style endpoint
    try {
      const res = await post('/auth/register', { email, password, username, fullName });
      return (res as any).data ?? res;
    } catch (err2) {
      // If both fail, surface original error
      throw err2;
    }
  }
}

/**
 * Logout current user
 *
 * @returns Success confirmation
 *
 * TODO: Backend Integration
 * - Endpoint: POST /auth/logout
 * - Request body: { refreshToken: string }
 * - Response: { error: false, message: "Logout successful", data: null }
 * - Invalidate refresh token on backend
 * - Clear all tokens from secure storage
 * - Clear user data from global state
 * - Navigate to login screen
 */
export async function logout() {
  // TODO: Replace with actual API call
  // const refreshToken = await getStoredRefreshToken();
  // return post('/auth/logout', { refreshToken });

  throw new Error('logout() not implemented - connect to backend endpoint');
}

/**
 * Refresh access token using refresh token
 *
 * @param refreshToken - Current refresh token
 * @returns New authentication tokens
 *
 * TODO: Backend Integration
 * - Endpoint: POST /auth/refresh
 * - Request body: { refreshToken: string }
 * - Response: { error: false, message: "Token refreshed", data: { tokens: AuthTokens } }
 * - Error codes:
 *   - 401: Invalid or expired refresh token (force logout)
 * - Store new tokens in secure storage
 * - This should be called automatically when access token expires
 */
export async function refreshAccessToken(_refreshToken: string) {
  // TODO: Replace with actual API call
  // return post<{ tokens: AuthTokens }>('/auth/refresh', { refreshToken });

  throw new Error('refreshAccessToken() not implemented - connect to backend endpoint');
}

/**
 * Get current authenticated user profile
 *
 * @returns Current user object
 *
 * TODO: Backend Integration
 * - Endpoint: GET /auth/me
 * - Headers: Authorization: Bearer {accessToken}
 * - Response: { error: false, message: "User profile retrieved", data: { user: User } }
 * - Error codes:
 *   - 401: Invalid or expired token
 * - Use this to verify session validity and sync user data
 */
export async function getCurrentUser() {
  // TODO: Replace with actual API call
  // return get<{ user: User }>('/auth/me');

  throw new Error('getCurrentUser() not implemented - connect to backend endpoint');
}

/**
 * Update user profile
 *
 * @param userId - User ID
 * @param updates - Partial user object with fields to update
 * @returns Updated user object
 *
 * TODO: Backend Integration
 * - Endpoint: PUT /auth/profile
 * - Headers: Authorization: Bearer {accessToken}
 * - Request body: Partial<User> (only fields to update)
 * - Response: { error: false, message: "Profile updated", data: { user: User } }
 * - Allowed fields: fullName, username, bio, avatar, phoneNumber, location, safetyPreferences
 * - Email changes may require verification
 * - Update user object in global state
 */
export async function updateProfile(_userId: string, _updates: Partial<User>) {
  // TODO: Replace with actual API call
  // return put<{ user: User }>('/auth/profile', updates);

  throw new Error('updateProfile() not implemented - connect to backend endpoint');
}

/**
 * Request password reset email
 *
 * @param email - User's email address
 * @returns Success confirmation
 *
 * TODO: Backend Integration
 * - Endpoint: POST /auth/forgot-password
 * - Request body: { email: string }
 * - Response: { error: false, message: "Password reset email sent", data: null }
 * - Backend sends email with reset token/link
 * - Return success even if email not found (security best practice)
 */
export async function forgotPassword(_email: string) {
  try {
    // Try GraphQL forgotPassword mutation first
    const gql = `mutation ForgotPassword($email: String!) {\n  forgotPassword(email: $email) { success message }\n}`;
    await post('/graphql', { query: gql, variables: { email: _email } });
    return { success: true };
  } catch (err) {
    // Fallback to REST endpoint
    const res = await post('/auth/forgot-password', { email: _email });
    return res.data;
  }
}

/**
 * Reset password using reset token
 *
 * @param token - Password reset token from email
 * @param newPassword - New password
 * @returns Success confirmation
 *
 * TODO: Backend Integration
 * - Endpoint: POST /auth/reset-password
 * - Request body: { token: string, newPassword: string }
 * - Response: { error: false, message: "Password reset successful", data: null }
 * - Error codes:
 *   - 400: Invalid or expired token
 *   - 400: Weak password
 * - Invalidate all existing sessions for that user
 */
export async function resetPassword(_token: string, _newPassword: string) {
  // TODO: Replace with actual API call
  // return post('/auth/reset-password', { token, newPassword });

  throw new Error('resetPassword() not implemented - connect to backend endpoint');
}

/**
 * Verify email address using verification token
 *
 * @param token - Email verification token from email
 * @returns Success confirmation
 *
 * TODO: Backend Integration
 * - Endpoint: POST /auth/verify-email
 * - Request body: { token: string }
 * - Response: { error: false, message: "Email verified", data: null }
 * - Error codes:
 *   - 400: Invalid or expired token
 *   - 409: Email already verified
 */
export async function verifyEmail(_token: string) {
  // TODO: Replace with actual API call
  // return post('/auth/verify-email', { token });

  throw new Error('verifyEmail() not implemented - connect to backend endpoint');
}
