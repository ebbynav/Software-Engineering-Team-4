import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../contexts/theme/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { PillChip } from '../components/chips/PillChip';
import { NEWS_ITEMS } from '../data/mockData';
import type { NewsItem } from '../data/mockData';

type NewsFilter = 'all' | 'top' | 'local' | 'safety';

interface ArticleCardProps extends NewsItem {
  isRead: boolean;
  onPress: () => void;
  onToggleBookmark: () => void;
  isBookmarked: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  excerpt,
  source,
  publishedAt,
  sentiment,
  imageUrl,
  category,
  isRead,
  onPress,
  onToggleBookmark,
  isBookmarked,
}) => {
  const colors = useThemeColors();

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const publishTime = new Date(timestamp);
    const diffMs = now.getTime() - publishTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getCategoryColor = (): string => {
    switch (category) {
      case 'top':
        return colors.primary;
      case 'safety':
        return colors.error;
      case 'local':
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  const getCategoryLabel = (): string => {
    switch (category) {
      case 'top':
        return 'TOP STORY';
      case 'safety':
        return 'SAFETY';
      case 'local':
        return 'LOCAL';
      default:
        return 'NEWS';
    }
  };

  const getSentimentIcon = (): string => {
    if (sentiment === 1) return '😊';
    if (sentiment === -1) return '😟';
    return '😐';
  };

  return (
    <TouchableOpacity
      style={[
        styles.articleCard,
        { backgroundColor: colors.card },
        isRead && styles.articleCardRead,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Image */}
      <Image source={{ uri: imageUrl }} style={styles.articleImage} resizeMode="cover" />

      {/* Unread indicator */}
      {!isRead && <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]} />}

      {/* Category badge */}
      <View style={[styles.categoryBadge, { backgroundColor: `${getCategoryColor()}20` }]}>
        <Text style={[styles.categoryText, { color: getCategoryColor() }]}>
          {getCategoryLabel()}
        </Text>
      </View>

      {/* Content */}
      <View style={styles.articleContent}>
        <Text
          style={[
            styles.articleTitle,
            { color: isRead ? colors.textSecondary : colors.textPrimary },
          ]}
          numberOfLines={2}
        >
          {title}
        </Text>
        <Text style={[styles.articleExcerpt, { color: colors.textSecondary }]} numberOfLines={2}>
          {excerpt}
        </Text>

        {/* Meta info */}
        <View style={styles.articleMeta}>
          <View style={styles.metaLeft}>
            <Text style={[styles.articleSource, { color: colors.textTertiary }]}>{source}</Text>
            <Text style={[styles.articleTime, { color: colors.textTertiary }]}>
              • {formatTimeAgo(publishedAt)}
            </Text>
          </View>
          <View style={styles.metaRight}>
            <Text style={styles.sentimentIcon}>{getSentimentIcon()}</Text>
            <TouchableOpacity
              onPress={onToggleBookmark}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.bookmarkIcon}>{isBookmarked ? '🔖' : '📑'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function NewsScreen() {
  const colors = useThemeColors();
  const [filter, setFilter] = useState<NewsFilter>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [readArticles, setReadArticles] = useState<Set<string>>(new Set());
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Set<string>>(new Set());

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate API refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleArticlePress = (articleId: string) => {
    setReadArticles(prev => new Set(prev).add(articleId));
    // Navigate to article detail or open in WebView
    console.log('Open article:', articleId);
  };

  const handleToggleBookmark = (articleId: string) => {
    setBookmarkedArticles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(articleId)) {
        newSet.delete(articleId);
      } else {
        newSet.add(articleId);
      }
      return newSet;
    });
  };

  const handleFilterChange = (newFilter: NewsFilter) => {
    setFilter(newFilter);
  };

  const filteredArticles = NEWS_ITEMS.filter(article => {
    if (filter === 'all') return true;
    return article.category === filter;
  });

  const unreadCount = filteredArticles.filter(article => !readArticles.has(article.id)).length;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>News Feed</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {unreadCount} unread {unreadCount === 1 ? 'article' : 'articles'}
          </Text>
        </View>
        <ThemeToggle />
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          <PillChip
            label="All"
            selected={filter === 'all'}
            onToggle={() => handleFilterChange('all')}
          />
          <PillChip
            label="Top Stories"
            selected={filter === 'top'}
            onToggle={() => handleFilterChange('top')}
          />
          <PillChip
            label="Local"
            selected={filter === 'local'}
            onToggle={() => handleFilterChange('local')}
          />
          <PillChip
            label="Safety"
            selected={filter === 'safety'}
            onToggle={() => handleFilterChange('safety')}
          />
        </ScrollView>
      </View>

      {/* Articles List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {filteredArticles.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
            <Text style={styles.emptyIcon}>📰</Text>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              No Articles Found
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Try changing your filter or pull to refresh
            </Text>
          </View>
        ) : (
          <>
            {/* Stats Bar */}
            <View style={[styles.statsBar, { backgroundColor: colors.card }]}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                  {filteredArticles.length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Articles</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.primary }]}>{unreadCount}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Unread</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.success }]}>
                  {bookmarkedArticles.size}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Saved</Text>
              </View>
            </View>

            {/* Article Cards */}
            {filteredArticles.map(article => (
              <ArticleCard
                key={article.id}
                {...article}
                isRead={readArticles.has(article.id)}
                onPress={() => handleArticlePress(article.id)}
                onToggleBookmark={() => handleToggleBookmark(article.id)}
                isBookmarked={bookmarkedArticles.has(article.id)}
              />
            ))}
          </>
        )}

        {/* Mark All as Read */}
        {filteredArticles.length > 0 && unreadCount > 0 && (
          <TouchableOpacity
            style={[styles.markAllButton, { backgroundColor: colors.card }]}
            onPress={() => {
              const allIds = filteredArticles.map(a => a.id);
              setReadArticles(prev => new Set([...prev, ...allIds]));
            }}
          >
            <Text style={[styles.markAllText, { color: colors.primary }]}>✓ Mark all as read</Text>
          </TouchableOpacity>
        )}

        {/* Bottom spacing */}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  filterRow: {
    gap: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  statsBar: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    marginHorizontal: 8,
  },
  articleCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  articleCardRead: {
    opacity: 0.7,
  },
  articleImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#E5E7EB',
  },
  unreadBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  articleContent: {
    padding: 16,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 24,
  },
  articleExcerpt: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  articleSource: {
    fontSize: 12,
    fontWeight: '600',
  },
  articleTime: {
    fontSize: 12,
    marginLeft: 4,
  },
  metaRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sentimentIcon: {
    fontSize: 16,
  },
  bookmarkIcon: {
    fontSize: 20,
  },
  emptyState: {
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  markAllButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  markAllText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
