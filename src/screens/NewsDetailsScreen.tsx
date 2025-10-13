import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../contexts/theme/ThemeContext';
import type { RootStackParamList } from '../navigation/types';
import type { StackScreenProps } from '@react-navigation/stack';

type Props = StackScreenProps<RootStackParamList, 'NewsDetails'>;

const MOCK_ARTICLE = {
  id: 'news-1',
  title: 'San Francisco Tourism Rebounds to Pre-Pandemic Levels',
  imageUrl: 'https://picsum.photos/800/400?random=60',
  content: `San Francisco officials reported record visitor numbers this week as major attractions reopened and cultural events returned to the city.

The tourism industry, which was severely impacted during the pandemic, has shown remarkable resilience with visitor numbers now matching and in some cases exceeding 2019 levels.

"We're thrilled to see our beloved city welcoming travelers from around the world again," said Mayor London Breed. "The return of tourism is not just about economic recovery—it's about the cultural exchange and vibrancy that makes San Francisco special."

Key attractions including Alcatraz Island, the Golden Gate Bridge visitor centers, and Fisherman's Wharf have all reported increased foot traffic. Hotel occupancy rates have climbed to 85%, a significant improvement from the 30% lows seen during lockdowns.

Local businesses, particularly those in hospitality and retail, are experiencing a much-needed boost. Restaurant reservations are up 120% compared to last year, and tour operators are reporting full bookings weeks in advance.

Safety measures remain in place across tourist districts, with enhanced security and emergency response systems now active in high-traffic areas. The city has also invested in improved wayfinding signage and multilingual support services.

Looking ahead, tourism officials are optimistic about sustained growth, with several major conferences and events scheduled for the remainder of the year.`,
  author: 'Sarah Chen',
  source: 'SF Chronicle',
  publishedAt: new Date(Date.now() - 3600000).toISOString(),
  sentiment: 1, // positive
  biasScore: 25, // low bias (0-100, lower is better)
};

const FLAG_REASONS = [
  'Misinformation',
  'Bias or Unfair Reporting',
  'Offensive Content',
  'Spam',
  'Other',
];

export default function NewsDetailsScreen({ route, navigation }: Props) {
  const colors = useThemeColors();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { newsId } = route.params || { newsId: 'news-1' };

  const [isSaved, setIsSaved] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    Alert.alert(
      isSaved ? 'Removed from Saved' : 'Saved!',
      isSaved
        ? 'Article removed from your saved articles'
        : 'Article saved for later reading'
    );
  };

  const handleShare = () => {
    Alert.alert('Share Article', 'Share this article with friends and family!');
  };

  const handleFlag = (reason: string) => {
    setShowFlagModal(false);
    Alert.alert(
      'Article Flagged',
      `Thank you for reporting. Our team will review this article for: ${reason}`
    );
  };

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

  const getSentimentIcon = (): string => {
    if (MOCK_ARTICLE.sentiment === 1) return '😊';
    if (MOCK_ARTICLE.sentiment === -1) return '😟';
    return '😐';
  };

  const getSentimentLabel = (): string => {
    if (MOCK_ARTICLE.sentiment === 1) return 'Positive';
    if (MOCK_ARTICLE.sentiment === -1) return 'Negative';
    return 'Neutral';
  };

  const getSentimentColor = (): string => {
    if (MOCK_ARTICLE.sentiment === 1) return colors.success;
    if (MOCK_ARTICLE.sentiment === -1) return colors.error;
    return colors.textSecondary;
  };

  const getBiasColor = (): string => {
    if (MOCK_ARTICLE.biasScore < 30) return colors.success;
    if (MOCK_ARTICLE.biasScore < 60) return colors.warning;
    return colors.error;
  };

  const getBiasLabel = (): string => {
    if (MOCK_ARTICLE.biasScore < 30) return 'Low Bias';
    if (MOCK_ARTICLE.biasScore < 60) return 'Moderate Bias';
    return 'High Bias';
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={[styles.backText, { color: colors.primary }]}>
            ‹ Back
          </Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Article
        </Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveIcon}>{isSaved ? '🔖' : '📑'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Featured Image */}
        <Image
          source={{ uri: MOCK_ARTICLE.imageUrl }}
          style={styles.featuredImage}
          resizeMode="cover"
        />

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Title */}
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {MOCK_ARTICLE.title}
          </Text>

          {/* Author & Source Row */}
          <View style={[styles.metaRow, { borderBottomColor: colors.border }]}>
            <View style={styles.authorSection}>
              <Text style={styles.authorAvatar}>✍️</Text>
              <View>
                <Text
                  style={[styles.authorName, { color: colors.textPrimary }]}
                >
                  {MOCK_ARTICLE.author}
                </Text>
                <Text
                  style={[styles.sourceName, { color: colors.textSecondary }]}
                >
                  {MOCK_ARTICLE.source} •{' '}
                  {formatTimeAgo(MOCK_ARTICLE.publishedAt)}
                </Text>
              </View>
            </View>
          </View>

          {/* Sentiment & Bias Indicators */}
          <View
            style={[styles.indicatorsCard, { backgroundColor: colors.card }]}
          >
            <View style={styles.indicatorRow}>
              <View style={styles.indicator}>
                <Text style={styles.indicatorIcon}>{getSentimentIcon()}</Text>
                <View style={styles.indicatorInfo}>
                  <Text
                    style={[
                      styles.indicatorLabel,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Sentiment
                  </Text>
                  <Text
                    style={[
                      styles.indicatorValue,
                      { color: getSentimentColor() },
                    ]}
                  >
                    {getSentimentLabel()}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.indicatorDivider,
                  { backgroundColor: colors.border },
                ]}
              />
              <View style={styles.indicator}>
                <Text style={styles.indicatorIcon}>📊</Text>
                <View style={styles.indicatorInfo}>
                  <Text
                    style={[
                      styles.indicatorLabel,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Bias Score
                  </Text>
                  <Text
                    style={[styles.indicatorValue, { color: getBiasColor() }]}
                  >
                    {getBiasLabel()}
                  </Text>
                </View>
              </View>
            </View>

            {/* Bias Meter Bar */}
            <View style={styles.biasMeterContainer}>
              <Text
                style={[styles.biasMeterLabel, { color: colors.textSecondary }]}
              >
                Bias Meter
              </Text>
              <View
                style={[
                  styles.biasMeterTrack,
                  { backgroundColor: colors.border },
                ]}
              >
                <View
                  style={[
                    styles.biasMeterFill,
                    {
                      backgroundColor: getBiasColor(),
                      width: `${MOCK_ARTICLE.biasScore}%`,
                    },
                  ]}
                />
              </View>
              <View style={styles.biasMeterLabels}>
                <Text
                  style={[styles.biasMeterText, { color: colors.textTertiary }]}
                >
                  0% Unbiased
                </Text>
                <Text
                  style={[styles.biasMeterText, { color: colors.textTertiary }]}
                >
                  100% Biased
                </Text>
              </View>
            </View>
          </View>

          {/* Article Content */}
          <Text style={[styles.contentText, { color: colors.textSecondary }]}>
            {MOCK_ARTICLE.content}
          </Text>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={handleShare}
            >
              <Text style={styles.actionIcon}>📤</Text>
              <Text style={[styles.actionText, { color: colors.textPrimary }]}>
                Share
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={handleSave}
            >
              <Text style={styles.actionIcon}>{isSaved ? '🔖' : '📑'}</Text>
              <Text style={[styles.actionText, { color: colors.textPrimary }]}>
                {isSaved ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => setShowFlagModal(true)}
            >
              <Text style={styles.actionIcon}>🚩</Text>
              <Text style={[styles.actionText, { color: colors.textPrimary }]}>
                Flag
              </Text>
            </TouchableOpacity>
          </View>

          {/* Info Note */}
          <View style={[styles.infoNote, { backgroundColor: colors.card }]}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              News articles are analyzed for sentiment and bias to help you make
              informed decisions.
            </Text>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Flag Modal */}
      <Modal
        visible={showFlagModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFlagModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContainer, { backgroundColor: colors.card }]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                Flag Article
              </Text>
              <TouchableOpacity onPress={() => setShowFlagModal(false)}>
                <Text
                  style={[styles.modalClose, { color: colors.textSecondary }]}
                >
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            <Text
              style={[styles.modalSubtitle, { color: colors.textSecondary }]}
            >
              Please select a reason for flagging this article:
            </Text>

            {FLAG_REASONS.map((reason, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.flagOption,
                  { borderBottomColor: colors.border },
                ]}
                onPress={() => handleFlag(reason)}
              >
                <Text
                  style={[styles.flagOptionText, { color: colors.textPrimary }]}
                >
                  {reason}
                </Text>
                <Text
                  style={[
                    styles.flagOptionArrow,
                    { color: colors.textTertiary },
                  ]}
                >
                  ›
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[
                styles.cancelButton,
                { backgroundColor: colors.background },
              ]}
              onPress={() => setShowFlagModal(false)}
            >
              <Text
                style={[styles.cancelButtonText, { color: colors.textPrimary }]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  backText: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveIcon: {
    fontSize: 24,
  },
  scrollView: {
    flex: 1,
  },
  featuredImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#E5E7EB',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    marginBottom: 16,
  },
  metaRow: {
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    fontSize: 32,
    marginRight: 12,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  sourceName: {
    fontSize: 13,
  },
  indicatorsCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  indicatorRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  indicator: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  indicatorInfo: {
    flex: 1,
  },
  indicatorLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  indicatorValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  indicatorDivider: {
    width: 1,
    marginHorizontal: 16,
  },
  biasMeterContainer: {
    marginTop: 8,
  },
  biasMeterLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  biasMeterTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  biasMeterFill: {
    height: '100%',
    borderRadius: 4,
  },
  biasMeterLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  biasMeterText: {
    fontSize: 10,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoNote: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalClose: {
    fontSize: 24,
    fontWeight: '600',
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  flagOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  flagOptionText: {
    fontSize: 16,
  },
  flagOptionArrow: {
    fontSize: 20,
  },
  cancelButton: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
