import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../contexts/theme/ThemeContext';
import type { RootStackParamList } from '../navigation/types';
import type { StackScreenProps } from '@react-navigation/stack';

type Props = StackScreenProps<RootStackParamList, 'RouteDetails'>;

interface Waypoint {
  id: string;
  title: string;
  description: string;
  distance: string;
  icon: string;
}

const MOCK_WAYPOINTS: Waypoint[] = [
  {
    id: '1',
    title: 'Eiffel Tower',
    description: 'Starting point • Iconic landmark',
    distance: '0 km',
    icon: '🗼',
  },
  {
    id: '2',
    title: 'Champ de Mars',
    description: 'Beautiful gardens with views',
    distance: '0.5 km',
    icon: '🌳',
  },
  {
    id: '3',
    title: "Pont de l'Alma",
    description: 'Historic bridge over Seine',
    distance: '1.2 km',
    icon: '🌉',
  },
  {
    id: '4',
    title: 'Musée du Quai Branly',
    description: 'Art and culture museum',
    distance: '2.1 km',
    icon: '🎨',
  },
  {
    id: '5',
    title: 'Les Invalides',
    description: 'Historic military complex',
    distance: '3.5 km',
    icon: '🏛️',
  },
  {
    id: '6',
    title: 'Musée Rodin',
    description: 'Beautiful sculpture gardens',
    distance: '4.2 km',
    icon: '🗿',
  },
  {
    id: '7',
    title: 'Saint-Germain-des-Prés',
    description: 'Historic neighborhood',
    distance: '5.2 km',
    icon: '⛪',
  },
];

export default function RouteDetailsScreen({ route, navigation }: Props) {
  const colors = useThemeColors();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { routeId } = route.params || { routeId: 'route-1' };

  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(342);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationProgress, setNavigationProgress] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<string[]>([
    'Amazing route! Felt very safe walking even at night.',
    'Beautiful sights, highly recommended for first-time visitors.',
  ]);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const likeScaleAnim = useRef(new Animated.Value(1)).current;

  const handleStartNavigation = () => {
    setIsNavigating(true);
    setNavigationProgress(0);

    // Animate progress from 0% to 100% over 5 seconds
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 5000,
      useNativeDriver: false,
    }).start(() => {
      Alert.alert('Route Complete!', 'You have completed this route. Great job!');
      setIsNavigating(false);
      setNavigationProgress(0);
      progressAnim.setValue(0);
    });

    // Update progress state for display
    const interval = setInterval(() => {
      setNavigationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const handleCancelNavigation = () => {
    progressAnim.stopAnimation();
    progressAnim.setValue(0);
    setIsNavigating(false);
    setNavigationProgress(0);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    Alert.alert(
      isSaved ? 'Removed from Saved' : 'Saved!',
      isSaved ? 'Route removed from your saved routes' : 'Route saved for later'
    );
  };

  const handleLike = () => {
    // Bounce animation
    Animated.sequence([
      Animated.spring(likeScaleAnim, {
        toValue: 1.3,
        useNativeDriver: true,
      }),
      Animated.spring(likeScaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleShare = () => {
    Alert.alert('Share Route', 'Share this route with friends and family!');
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      setComments([commentText, ...comments]);
      setCommentText('');
      Alert.alert('Comment Added!', 'Your comment has been posted.');
    }
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      {/* Header */}
      <View
        style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={[styles.backText, { color: colors.primary }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Route Details</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveIcon}>{isSaved ? '🔖' : '📑'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Banner Image */}
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: 'https://picsum.photos/800/400?random=50' }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={[styles.bannerOverlay, { backgroundColor: colors.overlay }]}>
            <Text style={styles.bannerTitle}>Historic Paris Walking Tour</Text>
            <Text style={styles.bannerSubtitle}>Downtown • Cultural Route</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={[styles.statsRow, { backgroundColor: colors.card }]}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>📏</Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>5.2 km</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Distance</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⏱️</Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>2h 30m</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Duration</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⛰️</Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>45m</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Elevation</Text>
          </View>
        </View>

        {/* Community Indicator */}
        <View style={[styles.communityCard, { backgroundColor: colors.card }]}>
          <Text style={styles.communityIcon}>👥</Text>
          <View style={styles.communityContent}>
            <Text style={[styles.communityText, { color: colors.textPrimary }]}>
              <Text style={{ fontWeight: '700' }}>120 people</Text> completed this route last week
            </Text>
            <View style={styles.likeRow}>
              <TouchableOpacity onPress={handleLike} activeOpacity={0.7}>
                <Animated.Text
                  style={[styles.likeButton, { transform: [{ scale: likeScaleAnim }] }]}
                >
                  {isLiked ? '❤️' : '🤍'}
                </Animated.Text>
              </TouchableOpacity>
              <Text style={[styles.likeCount, { color: colors.textSecondary }]}>
                {likeCount} likes
              </Text>
            </View>
          </View>
        </View>

        {/* Navigation Progress */}
        {isNavigating && (
          <View style={[styles.navigationCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.navigationTitle, { color: colors.textPrimary }]}>
              Navigation Active
            </Text>
            <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
              <Animated.View
                style={[
                  styles.progressBar,
                  { backgroundColor: colors.primary, width: progressWidth },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              {Math.round(navigationProgress)}% Complete
            </Text>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: `${colors.error}20` }]}
              onPress={handleCancelNavigation}
            >
              <Text style={[styles.cancelButtonText, { color: colors.error }]}>
                Cancel Navigation
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Waypoints List */}
        <View style={[styles.waypointsCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            📍 Waypoints ({MOCK_WAYPOINTS.length})
          </Text>
          {MOCK_WAYPOINTS.map((waypoint, index) => (
            <View key={waypoint.id}>
              <View style={styles.waypoint}>
                <View style={styles.waypointLeft}>
                  <Text style={styles.waypointIcon}>{waypoint.icon}</Text>
                  <View style={styles.waypointInfo}>
                    <Text style={[styles.waypointTitle, { color: colors.textPrimary }]}>
                      {waypoint.title}
                    </Text>
                    <Text style={[styles.waypointDesc, { color: colors.textSecondary }]}>
                      {waypoint.description}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.waypointDistance, { color: colors.textTertiary }]}>
                  {waypoint.distance}
                </Text>
              </View>
              {index < MOCK_WAYPOINTS.length - 1 && (
                <View style={[styles.waypointLine, { backgroundColor: colors.border }]} />
              )}
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              {
                backgroundColor: isNavigating ? colors.textSecondary : colors.primary,
              },
            ]}
            onPress={handleStartNavigation}
            disabled={isNavigating}
          >
            <Text style={styles.primaryButtonText}>
              {isNavigating ? '🧭 Navigating...' : '🚀 Start Navigation'}
            </Text>
          </TouchableOpacity>
          <View style={styles.secondaryButtons}>
            <TouchableOpacity
              style={[
                styles.secondaryButton,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={handleShare}
            >
              <Text style={styles.secondaryButtonIcon}>📤</Text>
              <Text style={[styles.secondaryButtonText, { color: colors.textPrimary }]}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.secondaryButton,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={handleSave}
            >
              <Text style={styles.secondaryButtonIcon}>{isSaved ? '🔖' : '📑'}</Text>
              <Text style={[styles.secondaryButtonText, { color: colors.textPrimary }]}>
                {isSaved ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Comments Section */}
        <View style={[styles.commentsCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            💬 Comments ({comments.length})
          </Text>

          {/* Add Comment */}
          <View style={styles.addCommentContainer}>
            <TextInput
              style={[
                styles.commentInput,
                {
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.textPrimary,
                },
              ]}
              placeholder="Add a comment..."
              placeholderTextColor={colors.textTertiary}
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <TouchableOpacity
              style={[styles.commentButton, { backgroundColor: colors.primary }]}
              onPress={handleAddComment}
              disabled={!commentText.trim()}
            >
              <Text style={styles.commentButtonText}>Post</Text>
            </TouchableOpacity>
          </View>

          {/* Comments List */}
          {comments.map((comment, index) => (
            <View key={index} style={[styles.commentItem, { borderTopColor: colors.border }]}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentAvatar}>👤</Text>
                <View style={styles.commentMeta}>
                  <Text style={[styles.commentAuthor, { color: colors.textPrimary }]}>
                    {index === 0 && commentText ? 'You' : 'Traveler'}
                  </Text>
                  <Text style={[styles.commentTime, { color: colors.textTertiary }]}>
                    {index === 0 && commentText ? 'Just now' : `${index + 1}d ago`}
                  </Text>
                </View>
              </View>
              <Text style={[styles.commentText, { color: colors.textSecondary }]}>{comment}</Text>
            </View>
          ))}
        </View>

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
  bannerContainer: {
    height: 300,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  statsRow: {
    flexDirection: 'row',
    padding: 20,
    marginHorizontal: 20,
    marginTop: -40,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    marginHorizontal: 12,
  },
  communityCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  communityIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  communityContent: {
    flex: 1,
  },
  communityText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    fontSize: 24,
    marginRight: 8,
  },
  likeCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  navigationCard: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  navigationTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    marginBottom: 12,
  },
  cancelButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  waypointsCard: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  waypoint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  waypointLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  waypointIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  waypointInfo: {
    flex: 1,
  },
  waypointTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  waypointDesc: {
    fontSize: 13,
  },
  waypointDistance: {
    fontSize: 12,
    marginLeft: 8,
  },
  waypointLine: {
    height: 1,
    marginLeft: 36,
    marginVertical: 4,
  },
  actionButtonsContainer: {
    marginHorizontal: 20,
    marginTop: 16,
  },
  primaryButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  secondaryButtonIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  commentsCard: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  addCommentContainer: {
    marginBottom: 16,
  },
  commentInput: {
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  commentButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  commentButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  commentItem: {
    paddingTop: 16,
    borderTopWidth: 1,
    marginTop: 16,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAvatar: {
    fontSize: 24,
    marginRight: 8,
  },
  commentMeta: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  commentTime: {
    fontSize: 12,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
