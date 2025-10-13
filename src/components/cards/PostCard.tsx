/**
 * @fileoverview PostCard - Social post card with user info and interactions
 * @purpose Displays user-generated content with social actions (like, comment, share)
 *
 * COMPONENT CONTRACT:
 *
 * Props:
 * - avatar: string - User avatar URL
 * - username: string - User display name
 * - timestamp: string - Post time (e.g., "2 hours ago")
 * - text: string - Post content text
 * - images?: string[] - Array of image URLs
 * - likes: number - Number of likes
 * - comments: number - Number of comments
 * - isLiked: boolean - Whether current user liked the post
 * - onPressUser: () => void - Handler for user profile press
 * - onLike: () => void - Handler for like button
 * - onComment: () => void - Handler for comment button
 * - onShare: () => void - Handler for share button
 * - style?: ViewStyle - Additional custom styles
 * - testID?: string - Testing identifier
 *
 * Visual Specifications:
 * - Layout: Vertical post card
 * - Header: Avatar (40px) + username + timestamp
 * - Text: 15px, textPrimary, multi-line
 * - Images: Horizontal carousel if multiple, 4:3 aspect if single
 * - Actions: Row with like/comment/share buttons
 * - Card: Rounded 12px, shadow elevation
 *
 * Behavior:
 * - Avatar/username press opens user profile
 * - Images are horizontally scrollable if multiple
 * - Like button animates and changes color
 * - Action buttons show counts
 * - Entire post is NOT clickable (only specific elements)
 *
 * EXAMPLE USAGE:
 * ```tsx
 * <PostCard
 *   avatar="https://..."
 *   username="Jane Doe"
 *   timestamp="2 hours ago"
 *   text="Just discovered this amazing cafe in Montmartre! ☕"
 *   images={["https://...", "https://..."]}
 *   likes={24}
 *   comments={5}
 *   isLiked={false}
 *   onPressUser={() => navigate('Profile', { userId: '123' })}
 *   onLike={handleLike}
 *   onComment={handleComment}
 *   onShare={handleShare}
 * />
 * ```
 *
 * TODO: Add mention/hashtag detection in text
 * TODO: Add video support
 * TODO: Add "see more" for long text
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ViewStyle,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useThemeColors } from '../../contexts';
import { Avatar } from '../Avatar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_WIDTH = SCREEN_WIDTH - 40; // Accounting for padding

interface PostCardProps {
  avatar: string;
  username: string;
  timestamp: string;
  text: string;
  images?: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
  onPressUser: () => void;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  style?: ViewStyle;
  testID?: string;
}

export const PostCard = React.memo<PostCardProps>(
  ({
    avatar,
    username,
    timestamp,
    text,
    images = [],
    likes,
    comments,
    isLiked,
    onPressUser,
    onLike,
    onComment,
    onShare,
    style,
    testID,
  }) => {
    const colors = useThemeColors();
    const likeScaleAnim = useRef(new Animated.Value(1)).current;

    const handleLikePress = () => {
      // Bounce animation
      Animated.sequence([
        Animated.spring(likeScaleAnim, {
          toValue: 1.2,
          useNativeDriver: true,
        }),
        Animated.spring(likeScaleAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();

      onLike();
    };

    return (
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card },
          Platform.OS === 'ios' ? styles.shadowIOS : styles.shadowAndroid,
          style,
        ]}
        testID={testID}
      >
        {/* Header */}
        <TouchableOpacity
          onPress={onPressUser}
          style={styles.header}
          activeOpacity={0.7}
        >
          <Avatar src={avatar} initials={username.charAt(0)} size={40} />
          <View style={styles.headerText}>
            <Text style={[styles.username, { color: colors.textPrimary }]}>
              {username}
            </Text>
            <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
              {timestamp}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Post Text */}
        <Text style={[styles.text, { color: colors.textPrimary }]}>{text}</Text>

        {/* Images */}
        {images.length > 0 && (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.imagesContainer}
          >
            {images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.image}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <Animated.View style={{ transform: [{ scale: likeScaleAnim }] }}>
            <TouchableOpacity
              onPress={handleLikePress}
              style={styles.actionButton}
              accessibilityRole="button"
              accessibilityLabel={isLiked ? 'Unlike' : 'Like'}
            >
              <Text style={styles.actionIcon}>{isLiked ? '❤️' : '🤍'}</Text>
              <Text
                style={[styles.actionText, { color: colors.textSecondary }]}
              >
                {likes}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            onPress={onComment}
            style={styles.actionButton}
            accessibilityRole="button"
            accessibilityLabel={`${comments} comments`}
          >
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={[styles.actionText, { color: colors.textSecondary }]}>
              {comments}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onShare}
            style={styles.actionButton}
            accessibilityRole="button"
            accessibilityLabel="Share post"
          >
            <Text style={styles.actionIcon}>↗️</Text>
            <Text style={[styles.actionText, { color: colors.textSecondary }]}>
              Share
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

PostCard.displayName = 'PostCard';

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
  },
  text: {
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 12,
  },
  imagesContainer: {
    marginHorizontal: -16,
    marginBottom: 12,
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH * 0.75, // 4:3 aspect ratio
    marginHorizontal: 16,
    borderRadius: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  shadowIOS: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  shadowAndroid: {
    elevation: 2,
  },
});
