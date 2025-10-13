/**
 * @fileoverview SearchBar - Text input with search icons and clear functionality
 * @purpose Provides consistent search input across explore and filter screens
 *
 * COMPONENT CONTRACT:
 *
 * Props:
 * - placeholder: string - Placeholder text
 * - value: string - Current search text value
 * - onChange: (text: string) => void - Handler for text changes
 * - onClear: () => void - Handler for clear button press
 * - onSubmit?: () => void - Optional handler for search submission
 * - autoFocus?: boolean - Auto-focus input on mount
 * - style?: ViewStyle - Additional custom styles
 * - testID?: string - Testing identifier
 *
 * Visual Specifications:
 * - Shape: Rounded rectangle (12px radius)
 * - Height: 48px
 * - Background: theme.colors.card
 * - Border: 1px solid theme.colors.border
 * - Left icon: 🔍 search icon (20px, textSecondary)
 * - Right icon: ✕ clear button (only when text present)
 * - Padding: 12px horizontal, 8px left for icon space
 * - Text: 16px, textPrimary
 * - Placeholder: textSecondary color
 *
 * Behavior:
 * - Shows clear button only when value is not empty
 * - Clear button clears text and calls onClear
 * - Return key triggers onSubmit if provided
 * - Keyboard type: default
 * - Return key type: search
 * - Auto-capitalization: none
 * - Auto-correct: false
 *
 * Accessibility:
 * - accessibilityLabel="Search input"
 * - accessibilityHint describes what can be searched
 * - Clear button has accessibilityLabel="Clear search"
 *
 * EXAMPLE USAGE:
 * ```tsx
 * // Basic search bar
 * <SearchBar
 *   placeholder="Search cities..."
 *   value={searchText}
 *   onChange={setSearchText}
 *   onClear={() => setSearchText('')}
 * />
 *
 * // With auto-focus and submit
 * <SearchBar
 *   placeholder="Search places"
 *   value={query}
 *   onChange={setQuery}
 *   onClear={handleClear}
 *   onSubmit={handleSearch}
 *   autoFocus
 * />
 * ```
 *
 * TODO: Add voice search button
 * TODO: Add search suggestions dropdown
 * TODO: Add loading indicator in input
 */

import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useThemeColors } from '../contexts';

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (text: string) => void;
  onClear: () => void;
  onSubmit?: () => void;
  autoFocus?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export const SearchBar = React.memo<SearchBarProps>(
  ({
    placeholder,
    value,
    onChange,
    onClear,
    onSubmit,
    autoFocus = false,
    style,
    testID,
  }) => {
    const colors = useThemeColors();

    const handleClear = () => {
      onChange('');
      onClear();
    };

    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
          style,
        ]}
      >
        <Text style={[styles.searchIcon, { color: colors.textSecondary }]}>
          🔍
        </Text>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          onSubmitEditing={onSubmit}
          autoFocus={autoFocus}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Search input"
          accessibilityHint={`Search for ${placeholder.toLowerCase()}`}
          testID={testID}
          style={[styles.input, { color: colors.textPrimary }]}
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            style={styles.clearButton}
          >
            <Text style={[styles.clearIcon, { color: colors.textSecondary }]}>
              ✕
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

SearchBar.displayName = 'SearchBar';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearIcon: {
    fontSize: 18,
  },
});
