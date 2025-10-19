/**
 * @fileoverview API Service - Core HTTP client for backend communication
 * @purpose Centralized axios configuration with interceptors and error handling
 *
 * Error Envelope Shape:
 * {
 *   error: boolean,       // true if request failed
 *   message: string,      // human-readable error message
 *   data?: any,          // optional error details or response data
 *   statusCode?: number  // HTTP status code
 * }
 *
 * Success Response Shape:
 * {
 *   error: false,
 *   message: string,      // success message
 *   data: any            // actual response payload
 * }
 */

import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

// Base URL from environment variable (fallback to localhost for development)
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Standard API Error Envelope
 */
export interface ApiErrorEnvelope {
  error: true;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  statusCode?: number;
}

/**
 * Standard API Success Envelope
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiSuccessEnvelope<T = any> {
  error: false;
  message: string;
  data: T;
}

/**
 * Union type for API responses
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiResponse<T = any> = ApiSuccessEnvelope<T> | ApiErrorEnvelope;

/**
 * Axios instance with pre-configured settings
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request Interceptor
 * - Adds authentication token to requests
 * - Logs outgoing requests in development
 * - Can add custom headers or modify request config
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Retrieve auth token from AsyncStorage (AUTH_TOKENS)
    try {
      const tokenJson = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKENS);
      if (tokenJson) {
        const parsed = JSON.parse(tokenJson) as { accessToken?: string };
        const authToken = parsed?.accessToken;
        if (authToken && config.headers) {
          config.headers.Authorization = `Bearer ${authToken}`;
        }
      }
    } catch (e) {
      // ignore token retrieval errors
      if (__DEV__) console.warn('Failed to read auth token from storage', e);
    }

    // Log requests in development mode
    if (__DEV__) {
      console.log('📤 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    // Handle request setup errors
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * - Transforms responses to standard envelope format
 * - Handles errors globally
 * - Logs responses in development
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse<ApiSuccessEnvelope> => {
    // Log responses in development mode
    if (__DEV__) {
      console.log('📥 API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    // If backend already sends envelope format, return as-is
    // Otherwise, wrap response in success envelope
    if (response.data && typeof response.data === 'object' && 'error' in response.data) {
      return response;
    }

    // Wrap raw response in success envelope
    response.data = {
      error: false,
      message: 'Success',
      data: response.data,
    };

    return response;
  },
  (error: AxiosError<ApiErrorEnvelope>) => {
    // Log errors in development mode
    if (__DEV__) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });
    }

    // Create standardized error envelope
    const errorEnvelope: ApiErrorEnvelope = {
      error: true,
      message: 'An unexpected error occurred',
      statusCode: error.response?.status,
    };

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const responseData = error.response.data;

      // If backend sends error envelope, use it
      if (responseData && typeof responseData === 'object' && 'message' in responseData) {
        errorEnvelope.message = responseData.message || errorEnvelope.message;
        errorEnvelope.data = responseData.data;
      } else {
        // Generate message based on status code
        switch (status) {
          case 400:
            errorEnvelope.message = 'Bad request. Please check your input.';
            break;
          case 401:
            errorEnvelope.message = 'Unauthorized. Please log in again.';
            // TODO: Clear auth token and redirect to login
            break;
          case 403:
            errorEnvelope.message = 'Access denied. You do not have permission.';
            break;
          case 404:
            errorEnvelope.message = 'Resource not found.';
            break;
          case 500:
            errorEnvelope.message = 'Server error. Please try again later.';
            break;
          case 503:
            errorEnvelope.message = 'Service unavailable. Please try again later.';
            break;
          default:
            errorEnvelope.message = `Request failed with status ${status}`;
        }
      }
    } else if (error.request) {
      // Request made but no response received (network error)
      errorEnvelope.message = 'Network error. Please check your connection.';
      errorEnvelope.statusCode = 0;
    } else {
      // Error in request setup
      errorEnvelope.message = error.message || 'Request failed to send';
    }

    // Surface errors to users (can be disabled or customized per-request)
    if (error.config?.headers?.['X-Show-Error'] !== 'false') {
      surfaceErrorToUser(errorEnvelope);
    }

    return Promise.reject(errorEnvelope);
  }
);

/**
 * Surface error messages to users via Alert
 * Can be customized to use toast notifications or other UI patterns
 */
function surfaceErrorToUser(error: ApiErrorEnvelope): void {
  // In production, you might want to filter out certain errors
  // or use a more sophisticated notification system
  Alert.alert('Error', error.message, [{ text: 'OK' }]);
}

/**
 * Helper function to make GET requests
 * @param url - Endpoint URL (relative to baseURL)
 * @param config - Optional axios config
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function get<T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiSuccessEnvelope<T>> {
  const response = await apiClient.get<ApiSuccessEnvelope<T>>(url, config);
  return response.data;
}

/**
 * Helper function to make POST requests
 * @param url - Endpoint URL (relative to baseURL)
 * @param data - Request body
 * @param config - Optional axios config
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function post<T = any>(
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiSuccessEnvelope<T>> {
  const response = await apiClient.post<ApiSuccessEnvelope<T>>(url, data, config);
  return response.data;
}

/**
 * Helper function to make PUT requests
 * @param url - Endpoint URL (relative to baseURL)
 * @param data - Request body
 * @param config - Optional axios config
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function put<T = any>(
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiSuccessEnvelope<T>> {
  const response = await apiClient.put<ApiSuccessEnvelope<T>>(url, data, config);
  return response.data;
}

/**
 * Helper function to make PATCH requests
 * @param url - Endpoint URL (relative to baseURL)
 * @param data - Request body
 * @param config - Optional axios config
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function patch<T = any>(
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiSuccessEnvelope<T>> {
  const response = await apiClient.patch<ApiSuccessEnvelope<T>>(url, data, config);
  return response.data;
}

/**
 * Helper function to make DELETE requests
 * @param url - Endpoint URL (relative to baseURL)
 * @param config - Optional axios config
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function del<T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiSuccessEnvelope<T>> {
  const response = await apiClient.delete<ApiSuccessEnvelope<T>>(url, config);
  return response.data;
}

/**
 * Export configured axios instance for advanced use cases
 */
export default apiClient;
