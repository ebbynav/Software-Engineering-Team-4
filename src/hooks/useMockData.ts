/**
 * @fileoverview useMockData Hook
 * @purpose Load JSON mock data with simulated network latency for development
 *
 * This hook loads mock data from src/assets/mocks/ directory and simulates
 * realistic network delays (200-600ms by default) to test loading states,
 * spinners, and skeleton screens during development.
 *
 * Available Mock Files:
 * - routes.json: Sample walking routes in San Francisco
 * - news.json: Sample news articles with sentiment analysis
 * - users.json: Sample user profiles
 * - safety.json: Neighborhood safety data with crime statistics
 *
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useMockData<Route[]>('routes');
 *
 * if (loading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage error={error} />;
 * if (!data) return null;
 *
 * return <RoutesList routes={data} />;
 * ```
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Available mock data files
 */
export type MockDataFile = 'routes' | 'news' | 'users' | 'safety';

/**
 * Hook configuration options
 */
export interface UseMockDataOptions {
  /**
   * Minimum simulated network delay in milliseconds
   * @default 200
   */
  minDelay?: number;

  /**
   * Maximum simulated network delay in milliseconds
   * @default 600
   */
  maxDelay?: number;

  /**
   * Whether to automatically fetch data on mount
   * @default true
   */
  autoFetch?: boolean;
}

/**
 * Hook return value
 */
export interface UseMockDataReturn<T> {
  /**
   * The loaded data, or null if not yet loaded
   */
  data: T | null;

  /**
   * Whether data is currently being loaded
   */
  loading: boolean;

  /**
   * Error encountered during data loading, if any
   */
  error: Error | null;

  /**
   * Manually trigger data fetch/refetch
   */
  refetch: () => Promise<void>;
}

/**
 * Load mock JSON data with simulated network latency
 *
 * @param filename - Name of the mock file (without .json extension)
 * @param options - Configuration options for delay and behavior
 * @returns Object with data, loading, error, and refetch
 *
 * @example
 * // Basic usage
 * const { data, loading, error } = useMockData<Route[]>('routes');
 *
 * @example
 * // Custom delay range (slower network)
 * const { data, loading, error } = useMockData<NewsArticle[]>('news', {
 *   minDelay: 500,
 *   maxDelay: 1500,
 * });
 *
 * @example
 * // Manual fetching only
 * const { data, loading, refetch } = useMockData<User[]>('users', {
 *   autoFetch: false,
 * });
 *
 * // Later...
 * <Button onPress={refetch}>Load Users</Button>
 *
 * @example
 * // With error handling
 * const { data, loading, error, refetch } = useMockData<Route[]>('routes');
 *
 * if (loading) {
 *   return <ActivityIndicator />;
 * }
 *
 * if (error) {
 *   return (
 *     <View>
 *       <Text>Failed to load routes: {error.message}</Text>
 *       <Button onPress={refetch}>Retry</Button>
 *     </View>
 *   );
 * }
 *
 * return <RoutesList routes={data || []} />;
 */
export function useMockData<T>(
  filename: MockDataFile,
  options: UseMockDataOptions = {}
): UseMockDataReturn<T> {
  const { minDelay = 200, maxDelay = 600, autoFetch = true } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Simulate random network delay
   */
  const simulateDelay = useCallback(() => {
    const delay = Math.random() * (maxDelay - minDelay) + minDelay;
    return new Promise(resolve => setTimeout(resolve, delay));
  }, [minDelay, maxDelay]);

  /**
   * Load mock data from file
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate network delay
      await simulateDelay();

      // Import mock data dynamically
      let mockData: T;

      switch (filename) {
        case 'routes':
          mockData = require('../../assets/mocks/routes.json') as T;
          break;
        case 'news':
          mockData = require('../../assets/mocks/news.json') as T;
          break;
        case 'users':
          mockData = require('../../assets/mocks/users.json') as T;
          break;
        case 'safety':
          mockData = require('../../assets/mocks/safety.json') as T;
          break;
        default:
          throw new Error(`Unknown mock file: ${filename}`);
      }

      setData(mockData);
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error(`Failed to load mock data: ${filename}`);
      setError(error);
      console.error(`useMockData error for file "${filename}":`, error);
    } finally {
      setLoading(false);
    }
  }, [filename, simulateDelay]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Usage Examples:
 *
 * 1. Routes List Screen
 * ----------------------
 * const RoutesScreen = () => {
 *   const { data: routes, loading, error, refetch } = useMockData<Route[]>('routes');
 *
 *   if (loading) {
 *     return <SkeletonLoader count={5} />;
 *   }
 *
 *   if (error) {
 *     return (
 *       <ErrorBoundary>
 *         <Text>{error.message}</Text>
 *         <Button onPress={refetch}>Retry</Button>
 *       </ErrorBoundary>
 *     );
 *   }
 *
 *   return (
 *     <FlatList
 *       data={routes || []}
 *       renderItem={({ item }) => <RouteCard route={item} />}
 *       keyExtractor={(item) => item.id}
 *     />
 *   );
 * };
 *
 *
 * 2. News Feed with Pull-to-Refresh
 * -----------------------------------
 * const NewsFeed = () => {
 *   const { data: articles, loading, refetch } = useMockData<NewsArticle[]>('news');
 *   const [refreshing, setRefreshing] = useState(false);
 *
 *   const handleRefresh = async () => {
 *     setRefreshing(true);
 *     await refetch();
 *     setRefreshing(false);
 *   };
 *
 *   return (
 *     <FlatList
 *       data={articles || []}
 *       renderItem={({ item }) => <NewsCard article={item} />}
 *       refreshControl={
 *         <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
 *       }
 *     />
 *   );
 * };
 *
 *
 * 3. Manual Fetch with Button
 * -----------------------------
 * const UserDirectory = () => {
 *   const { data: users, loading, error, refetch } = useMockData<User[]>('users', {
 *     autoFetch: false,
 *   });
 *
 *   if (!data && !loading) {
 *     return (
 *       <View>
 *         <Text>Ready to load users</Text>
 *         <Button onPress={refetch}>Load Users</Button>
 *       </View>
 *     );
 *   }
 *
 *   if (loading) {
 *     return <ActivityIndicator />;
 *   }
 *
 *   return (
 *     <FlatList
 *       data={users || []}
 *       renderItem={({ item }) => <UserCard user={item} />}
 *     />
 *   );
 * };
 *
 *
 * 4. Safety Dashboard with Slow Network Simulation
 * --------------------------------------------------
 * const SafetyDashboard = () => {
 *   // Simulate slow 3G network
 *   const { data: safetyData, loading } = useMockData<SafetyRecord[]>('safety', {
 *     minDelay: 1000,
 *     maxDelay: 2000,
 *   });
 *
 *   if (loading) {
 *     return <LoadingSkeleton />;
 *   }
 *
 *   return (
 *     <ScrollView>
 *       {safetyData?.map((record) => (
 *         <SafetyCard key={record.id} data={record} />
 *       ))}
 *     </ScrollView>
 *   );
 * };
 *
 *
 * 5. Multiple Data Sources
 * -------------------------
 * const Dashboard = () => {
 *   const { data: routes, loading: routesLoading } = useMockData<Route[]>('routes');
 *   const { data: news, loading: newsLoading } = useMockData<NewsArticle[]>('news');
 *   const { data: users, loading: usersLoading } = useMockData<User[]>('users');
 *
 *   const isLoading = routesLoading || newsLoading || usersLoading;
 *
 *   if (isLoading) {
 *     return <LoadingScreen />;
 *   }
 *
 *   return (
 *     <ScrollView>
 *       <FeaturedRoutes routes={routes?.slice(0, 3) || []} />
 *       <TrendingNews articles={news?.slice(0, 5) || []} />
 *       <TopContributors users={users?.slice(0, 10) || []} />
 *     </ScrollView>
 *   );
 * };
 *
 *
 * Testing Loading States:
 * ------------------------
 * This hook is perfect for testing:
 * - Skeleton loaders and shimmer effects
 * - Loading spinners and progress indicators
 * - Error boundaries and retry mechanisms
 * - Pull-to-refresh interactions
 * - Empty state handling
 *
 *
 * Migration to Real API:
 * -----------------------
 * When ready to switch to real backend:
 *
 * 1. Replace useMockData with actual API service:
 *    const { data, loading, error } = useMockData<Route[]>('routes');
 *    ↓
 *    const { data, loading, error } = useRoutes();
 *
 * 2. Keep the same interface (data, loading, error, refetch)
 *
 * 3. Maintain backward compatibility with custom hook:
 *    const USE_MOCK_DATA = __DEV__ && false;
 *    const useRoutesData = USE_MOCK_DATA ? useMockData : useRoutes;
 */
