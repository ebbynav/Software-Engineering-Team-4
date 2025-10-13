/**
 * @fileoverview Formatting Utilities
 * @purpose Consistent formatting for distances, durations, and timestamps
 *
 * These helper functions provide user-friendly display formatting for:
 * - Distance (meters → "5.2 km" or "850 m")
 * - Duration (seconds → "1h 30m" or "45 min")
 * - Time ago (ISO timestamp → "2h ago" or "3d ago")
 */

/**
 * Format distance in meters to human-readable string
 *
 * @param meters - Distance in meters
 * @returns Formatted distance string (e.g., "5.2 km" or "850 m")
 *
 * @example
 * formatDistance(5200)  // "5.2 km"
 * formatDistance(850)   // "850 m"
 * formatDistance(1000)  // "1.0 km"
 * formatDistance(42195) // "42.2 km" (marathon distance)
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }

  const kilometers = meters / 1000;
  return `${kilometers.toFixed(1)} km`;
}

/**
 * Format duration in seconds to human-readable string
 *
 * @param seconds - Duration in seconds
 * @returns Formatted duration string (e.g., "1h 30m" or "45 min")
 *
 * @example
 * formatDuration(3600)   // "1h"
 * formatDuration(5400)   // "1h 30m"
 * formatDuration(2700)   // "45 min"
 * formatDuration(90)     // "2 min"
 * formatDuration(45)     // "< 1 min"
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return '< 1 min';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);

  if (hours > 0) {
    if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  }

  return `${minutes} min`;
}

/**
 * Format ISO timestamp to relative time string
 *
 * @param timestamp - ISO 8601 timestamp string
 * @returns Formatted relative time (e.g., "2h ago", "3d ago", "just now")
 *
 * @example
 * formatTimeAgo('2024-01-15T10:00:00Z')  // "2h ago" (if now is 12:00)
 * formatTimeAgo('2024-01-12T10:00:00Z')  // "3d ago" (if now is Jan 15)
 * formatTimeAgo('2024-01-15T11:58:00Z')  // "2m ago" (if now is 12:00)
 * formatTimeAgo('2024-01-01T10:00:00Z')  // "2w ago" (if now is Jan 15)
 * formatTimeAgo('2023-12-15T10:00:00Z')  // "1mo ago" (if now is Jan 15)
 */
export function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 60) {
    return 'just now';
  }

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) {
    return `${diffWeeks}w ago`;
  }

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths}mo ago`;
  }

  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears}y ago`;
}

/**
 * Format elevation gain in meters with appropriate unit
 *
 * @param meters - Elevation gain in meters
 * @returns Formatted elevation string (e.g., "150 m" or "1.2 km")
 *
 * @example
 * formatElevation(150)   // "150 m"
 * formatElevation(1200)  // "1.2 km"
 * formatElevation(50)    // "50 m"
 */
export function formatElevation(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }

  const kilometers = meters / 1000;
  return `${kilometers.toFixed(1)} km`;
}

/**
 * Format safety score (0-100) to descriptive label
 *
 * @param score - Safety score (0-100)
 * @returns Safety level label
 *
 * @example
 * formatSafetyLevel(95)  // "Very Safe"
 * formatSafetyLevel(82)  // "Safe"
 * formatSafetyLevel(68)  // "Moderately Safe"
 * formatSafetyLevel(45)  // "Caution Advised"
 * formatSafetyLevel(20)  // "Unsafe"
 */
export function formatSafetyLevel(score: number): string {
  if (score >= 90) return 'Very Safe';
  if (score >= 75) return 'Safe';
  if (score >= 60) return 'Moderately Safe';
  if (score >= 40) return 'Caution Advised';
  return 'Unsafe';
}

/**
 * Format number with thousands separator
 *
 * @param value - Number to format
 * @returns Formatted number string
 *
 * @example
 * formatNumber(1234)      // "1,234"
 * formatNumber(1234567)   // "1,234,567"
 * formatNumber(42)        // "42"
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

/**
 * Format rating (0-5) to display string with star emoji
 *
 * @param rating - Rating value (0-5)
 * @param includeStars - Whether to include star emoji (default: true)
 * @returns Formatted rating string
 *
 * @example
 * formatRating(4.5)              // "4.5 ⭐"
 * formatRating(3.2)              // "3.2 ⭐"
 * formatRating(4.5, false)       // "4.5"
 * formatRating(5.0)              // "5.0 ⭐"
 */
export function formatRating(
  rating: number,
  includeStars: boolean = true
): string {
  const formatted = rating.toFixed(1);
  return includeStars ? `${formatted} ⭐` : formatted;
}

/**
 * Format percentage (0-100) to display string
 *
 * @param value - Percentage value (0-100)
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string
 *
 * @example
 * formatPercentage(75)        // "75%"
 * formatPercentage(33.333, 1) // "33.3%"
 * formatPercentage(100)       // "100%"
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Truncate text to specified length with ellipsis
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 *
 * @example
 * truncateText('This is a very long text', 10)  // "This is a..."
 * truncateText('Short', 10)                     // "Short"
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Usage Examples:
 *
 * 1. Route Card Display
 * ----------------------
 * const RouteCard = ({ route }) => (
 *   <View>
 *     <Text>{formatDistance(route.distanceMeters)}</Text>
 *     <Text>{formatDuration(route.durationMinutes * 60)}</Text>
 *     <Text>{formatElevation(route.elevationGain)}</Text>
 *     <Text>{formatSafetyLevel(route.safetyScore)}</Text>
 *     <Text>{formatRating(route.averageRating)}</Text>
 *     <Text>{formatNumber(route.likes)} likes</Text>
 *   </View>
 * );
 *
 *
 * 2. News Article Timestamp
 * --------------------------
 * const NewsCard = ({ article }) => (
 *   <View>
 *     <Text>{article.title}</Text>
 *     <Text>{formatTimeAgo(article.publishedAt)}</Text>
 *     <Text>{formatNumber(article.views)} views</Text>
 *   </View>
 * );
 *
 *
 * 3. Search Results
 * ------------------
 * const RouteSearchResult = ({ route }) => (
 *   <View>
 *     <Text>{route.title}</Text>
 *     <Text>{truncateText(route.description, 100)}</Text>
 *     <Text>
 *       {formatDistance(route.distanceMeters)} ·
 *       {formatDuration(route.durationMinutes * 60)} ·
 *       {formatSafetyLevel(route.safetyScore)}
 *     </Text>
 *   </View>
 * );
 *
 *
 * 4. User Stats Display
 * ----------------------
 * const UserProfile = ({ user }) => {
 *   const totalDistance = user.completedRoutes.reduce(
 *     (sum, route) => sum + route.distanceMeters, 0
 *   );
 *
 *   return (
 *     <View>
 *       <Text>{formatDistance(totalDistance)} walked</Text>
 *       <Text>{formatNumber(user.completedRoutes.length)} routes completed</Text>
 *     </View>
 *   );
 * };
 *
 *
 * 5. Safety Dashboard
 * --------------------
 * const SafetyScore = ({ neighborhood }) => (
 *   <View>
 *     <Text>{neighborhood.name}</Text>
 *     <Text>Safety: {formatSafetyLevel(neighborhood.safetyScore)}</Text>
 *     <Text>Score: {formatPercentage(neighborhood.safetyScore)}</Text>
 *     <Text>Updated {formatTimeAgo(neighborhood.updatedAt)}</Text>
 *   </View>
 * );
 */
