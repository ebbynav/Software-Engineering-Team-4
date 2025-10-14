/**
 * ExploreScreen - Discovery & Search
 *
 * LAYOUT:
 * - Sticky filter chips row (Category, Safety, Distance)
 * - Map placeholder (tall, non-functional for now)
 * - Vertical list of RouteCard items
 * - FAB (Floating Action Button) bottom-right "Create Route"
 *
 * INTERACTIONS:
 * - Filters animate chip toggle; list re-sorts locally (mocked)
 * - Create Route button opens modal (UI only)
 * - Tapping route card navigates to details
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../contexts/theme/ThemeContext';
import { ThemeToggle, PillChip, RouteCard } from '../components';
import { EXPLORE_ITEMS, ExploreItem } from '../data/mockData';

type FilterCategory = 'all' | 'culture' | 'nature' | 'food' | 'adventure';
type SafetyFilter = 'all' | 'high' | 'medium';
type DistanceFilter = 'all' | 'near' | 'medium' | 'far';

export default function ExploreScreen() {
  const colors = useThemeColors();

  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('all');
  const [safetyFilter, setSafetyFilter] = useState<SafetyFilter>('all');
  const [distanceFilter, setDistanceFilter] = useState<DistanceFilter>('all');
  const [items, setItems] = useState(EXPLORE_ITEMS);

  const handleFilterChange = () => {
    // Mock filtering - in real app would filter based on criteria
    let filtered = [...EXPLORE_ITEMS];

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item =>
        item.tags.some(tag => tag.toLowerCase().includes(categoryFilter))
      );
    }

    // Apply safety filter
    if (safetyFilter === 'high') {
      filtered = filtered.filter(item => item.safetyScore >= 90);
    } else if (safetyFilter === 'medium') {
      filtered = filtered.filter(
        item => item.safetyScore >= 70 && item.safetyScore < 90
      );
    }

    // Apply distance filter
    if (distanceFilter === 'near') {
      filtered = filtered.filter(item => item.distanceMeters < 2000);
    } else if (distanceFilter === 'medium') {
      filtered = filtered.filter(
        item => item.distanceMeters >= 2000 && item.distanceMeters < 5000
      );
    } else if (distanceFilter === 'far') {
      filtered = filtered.filter(item => item.distanceMeters >= 5000);
    }

    setItems(filtered);
  };

  const handleCategoryChange = (category: FilterCategory) => {
    setCategoryFilter(category);
    setTimeout(handleFilterChange, 100);
  };

  const handleSafetyChange = (safety: SafetyFilter) => {
    setSafetyFilter(safety);
    setTimeout(handleFilterChange, 100);
  };

  const handleDistanceChange = (distance: DistanceFilter) => {
    setDistanceFilter(distance);
    setTimeout(handleFilterChange, 100);
  };

  const handleCreateRoute = () => {
    Alert.alert(
      'Create Route',
      'Route creation feature coming soon! This will open a form to create a custom route.',
      [{ text: 'OK' }]
    );
  };

  const handleRoutePress = (item: ExploreItem) => {
    console.log('Navigate to route/place:', item.id);
    // TODO: Navigate to details screen
  };

  const handleSaveToggle = (itemId: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, isSaved: !item.isSaved } : item
      )
    );
  };

  const formatDistance = (meters: number): string => {
    if (meters === 0) return 'Destination';
    const km = meters / 1000;
    return km < 1 ? `${meters}m away` : `${km.toFixed(1)}km away`;
  };

  const formatDuration = (minutes?: number): string => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
  };

  const renderItem = ({ item }: { item: ExploreItem }) => (
    <View style={styles.routeCardWrapper}>
      <RouteCard
        title={item.title}
        distance={formatDistance(item.distanceMeters)}
        duration={formatDuration(item.estimatedMinutes)}
        tags={item.tags}
        mapPreview={item.thumbnailUrl}
        isSaved={item.isSaved}
        onPress={() => handleRoutePress(item)}
        onToggleSave={() => handleSaveToggle(item.id)}
      />
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Explore
        </Text>
        <ThemeToggle size={20} />
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Sticky Filter Chips */}
        <View
          style={[styles.filterContainer, { backgroundColor: colors.background }]}
        >
          <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>
            Category
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            <PillChip
              label="All"
              selected={categoryFilter === 'all'}
              onToggle={() => handleCategoryChange('all')}
            />
            <PillChip
              label="Culture"
              selected={categoryFilter === 'culture'}
              onToggle={() => handleCategoryChange('culture')}
            />
            <PillChip
              label="Nature"
              selected={categoryFilter === 'nature'}
              onToggle={() => handleCategoryChange('nature')}
            />
            <PillChip
              label="Food"
              selected={categoryFilter === 'food'}
              onToggle={() => handleCategoryChange('food')}
            />
            <PillChip
              label="Adventure"
              selected={categoryFilter === 'adventure'}
              onToggle={() => handleCategoryChange('adventure')}
            />
          </ScrollView>

          <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>
            Safety
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
          <PillChip
            label="All"
            selected={safetyFilter === 'all'}
            onToggle={() => handleSafetyChange('all')}
          />
          <PillChip
            label="High (90+)"
            selected={safetyFilter === 'high'}
            onToggle={() => handleSafetyChange('high')}
          />
          <PillChip
            label="Medium (70+)"
            selected={safetyFilter === 'medium'}
            onToggle={() => handleSafetyChange('medium')}
          />
        </ScrollView>

        <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>
          Distance
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          <PillChip
            label="All"
            selected={distanceFilter === 'all'}
            onToggle={() => handleDistanceChange('all')}
          />
          <PillChip
            label="Near (<2km)"
            selected={distanceFilter === 'near'}
            onToggle={() => handleDistanceChange('near')}
          />
          <PillChip
            label="Medium (2-5km)"
            selected={distanceFilter === 'medium'}
            onToggle={() => handleDistanceChange('medium')}
          />
          <PillChip
            label="Far (>5km)"
            selected={distanceFilter === 'far'}
            onToggle={() => handleDistanceChange('far')}
          />
        </ScrollView>
      </View>

      {/* Map Placeholder */}
      <View
        style={[
          styles.mapPlaceholder,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={styles.mapIcon}>🗺️</Text>
        <Text style={[styles.mapText, { color: colors.textSecondary }]}>
          Interactive Map
        </Text>
        <Text style={[styles.mapSubtext, { color: colors.textTertiary }]}>
          Map view coming soon
        </Text>
      </View>

        {/* Route List */}
        <View style={styles.listHeader}>
          <Text style={[styles.listTitle, { color: colors.textPrimary }]}>
            {items.length} {items.length === 1 ? 'Result' : 'Results'}
          </Text>
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No routes match your filters
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
              Try adjusting your search criteria
            </Text>
          </View>
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.routeCardWrapper}>
              <RouteCard
                title={item.title}
                distance={formatDistance(item.distanceMeters)}
                duration={formatDuration(item.estimatedMinutes)}
                tags={item.tags}
                mapPreview={item.thumbnailUrl}
                isSaved={item.isSaved}
                onPress={() => handleRoutePress(item)}
                onToggleSave={() => handleSaveToggle(item.id)}
              />
            </View>
          ))
        )}
      </ScrollView>

      {/* FAB - Create Route */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={handleCreateRoute}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
        <Text style={styles.fabText}>Create</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  filterContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  filterRow: {
    paddingHorizontal: 16,
    gap: 8,
  },
  mapPlaceholder: {
    height: 200,
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  mapText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  mapSubtext: {
    fontSize: 12,
  },
  listHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 100,
  },
  routeCardWrapper: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 32,
  },
  fabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 2,
  },
});
