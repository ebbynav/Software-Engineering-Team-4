/**
 * @fileoverview useDebouncedValue Hook
 * @purpose Debounces a value to reduce frequent updates (e.g., search inputs)
 *
 * Use this hook when you need to delay processing of rapidly changing values,
 * such as search queries, filter inputs, or real-time form validation.
 *
 * Default debounce delay: 300ms
 *
 * @example
 * ```tsx
 * const [searchQuery, setSearchQuery] = useState('');
 * const debouncedQuery = useDebouncedValue(searchQuery, 500);
 *
 * useEffect(() => {
 *   // Only runs 500ms after user stops typing
 *   if (debouncedQuery) {
 *     fetchSearchResults(debouncedQuery);
 *   }
 * }, [debouncedQuery]);
 *
 * return (
 *   <TextInput
 *     value={searchQuery}
 *     onChangeText={setSearchQuery}
 *     placeholder="Search..."
 *   />
 * );
 * ```
 */

import { useState, useEffect } from 'react';

/**
 * Debounce a value to reduce update frequency
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns Debounced value that updates after the delay period
 *
 * @example
 * // Search input with 300ms debounce (default)
 * const debouncedSearch = useDebouncedValue(searchText);
 *
 * @example
 * // Filter input with custom 500ms debounce
 * const debouncedFilter = useDebouncedValue(filterValue, 500);
 */
export function useDebouncedValue<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timeout if value changes before delay expires
    // This ensures we only update after user stops changing the value
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Usage Examples:
 *
 * 1. Search input with API calls
 * --------------------------------
 * const [query, setQuery] = useState('');
 * const debouncedQuery = useDebouncedValue(query);
 *
 * useEffect(() => {
 *   if (debouncedQuery.length >= 3) {
 *     searchAPI(debouncedQuery);
 *   }
 * }, [debouncedQuery]);
 *
 *
 * 2. Filter with immediate UI update but delayed API call
 * --------------------------------------------------------
 * const [filter, setFilter] = useState('');
 * const debouncedFilter = useDebouncedValue(filter, 500);
 *
 * // UI shows immediate feedback with local filter
 * const localResults = items.filter(item =>
 *   item.name.includes(filter)
 * );
 *
 * // But API is only called after 500ms of no changes
 * useEffect(() => {
 *   fetchFilteredResults(debouncedFilter);
 * }, [debouncedFilter]);
 *
 *
 * 3. Form validation with debounce
 * ---------------------------------
 * const [email, setEmail] = useState('');
 * const debouncedEmail = useDebouncedValue(email, 400);
 *
 * useEffect(() => {
 *   if (debouncedEmail) {
 *     validateEmailAvailability(debouncedEmail);
 *   }
 * }, [debouncedEmail]);
 *
 *
 * Performance Benefits:
 * ---------------------
 * - Reduces API calls by waiting for user to stop typing
 * - Prevents UI thrashing from rapid state updates
 * - Saves network bandwidth and server resources
 * - Improves perceived performance by showing instant local updates
 *
 *
 * Common Use Cases:
 * -----------------
 * - Search bars (instant typing, delayed API call)
 * - Filter inputs (multiple filters combining)
 * - Auto-save functionality (wait for user to finish editing)
 * - Real-time validation (check username availability)
 * - Scroll position tracking (update header on scroll stop)
 * - Window resize handlers (adjust layout after resize complete)
 */
