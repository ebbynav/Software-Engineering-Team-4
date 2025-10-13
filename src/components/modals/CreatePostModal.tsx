import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../../contexts/theme/ThemeContext';

type PostType = 'Post' | 'Poll' | 'Question' | 'Adoption';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onPostCreated?: (post: {
    id: string;
    type: PostType;
    content: string;
    hasImage: boolean;
    timestamp: string;
    author: string;
    avatar: string;
  }) => void;
}

const POST_TYPES: PostType[] = ['Post', 'Poll', 'Question', 'Adoption'];

const POST_TYPE_ICONS: Record<PostType, string> = {
  Post: '📝',
  Poll: '📊',
  Question: '❓',
  Adoption: '🐾',
};

export default function CreatePostModal({
  visible,
  onClose,
  onPostCreated,
}: CreatePostModalProps) {
  const colors = useThemeColors();
  const [selectedType, setSelectedType] = useState<PostType>('Post');
  const [content, setContent] = useState('');
  const [hasImage, setHasImage] = useState(false);

  const handlePost = () => {
    if (!content.trim()) {
      Alert.alert('Empty Post', 'Please add some content to your post');
      return;
    }

    const newPost = {
      id: `post-${Date.now()}`,
      type: selectedType,
      content: content.trim(),
      hasImage,
      timestamp: new Date().toISOString(),
      author: 'You',
      avatar: '👤',
    };

    // Call callback if provided
    onPostCreated?.(newPost);

    // Show success message
    Alert.alert(
      'Posted!',
      `Your ${selectedType.toLowerCase()} has been shared with the community.`,
      [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setContent('');
            setHasImage(false);
            setSelectedType('Post');
            onClose();
          },
        },
      ]
    );
  };

  const handleImagePicker = () => {
    setHasImage(!hasImage);
    Alert.alert(
      hasImage ? 'Image Removed' : 'Image Added',
      hasImage
        ? 'Image removed from post'
        : 'Image picker placeholder - in production, this would open your camera roll'
    );
  };

  const handleCancel = () => {
    if (content.trim()) {
      Alert.alert('Discard Post?', 'Your changes will not be saved.', [
        { text: 'Keep Editing', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            setContent('');
            setHasImage(false);
            setSelectedType('Post');
            onClose();
          },
        },
      ]);
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
            <Text
              style={[styles.headerButtonText, { color: colors.textSecondary }]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Create Post
          </Text>
          <TouchableOpacity
            onPress={handlePost}
            style={[
              styles.postButton,
              {
                backgroundColor: content.trim()
                  ? colors.primary
                  : colors.border,
              },
            ]}
            disabled={!content.trim()}
          >
            <Text
              style={[
                styles.postButtonText,
                { color: content.trim() ? '#FFFFFF' : colors.textTertiary },
              ]}
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Post Type Selector - Pill Menu */}
          <View style={styles.typeSelector}>
            <Text
              style={[
                styles.typeSelectorLabel,
                { color: colors.textSecondary },
              ]}
            >
              Post Type
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.typePills}
              contentContainerStyle={styles.typePillsContent}
            >
              {POST_TYPES.map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typePill,
                    {
                      backgroundColor:
                        selectedType === type ? colors.primary : colors.card,
                      borderColor:
                        selectedType === type ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => setSelectedType(type)}
                >
                  <Text style={styles.typePillIcon}>
                    {POST_TYPE_ICONS[type]}
                  </Text>
                  <Text
                    style={[
                      styles.typePillText,
                      {
                        color:
                          selectedType === type
                            ? '#FFFFFF'
                            : colors.textPrimary,
                      },
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Content Input */}
          <View style={styles.inputSection}>
            <View style={styles.authorRow}>
              <Text style={styles.authorAvatar}>👤</Text>
              <Text style={[styles.authorName, { color: colors.textPrimary }]}>
                You
              </Text>
            </View>
            <TextInput
              style={[styles.textInput, { color: colors.textPrimary }]}
              placeholder={`What's on your mind about ${selectedType === 'Adoption' ? 'pet adoption' : 'your neighborhood'}?`}
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              value={content}
              onChangeText={setContent}
              autoFocus
            />
          </View>

          {/* Image Picker Placeholder */}
          <TouchableOpacity
            style={[
              styles.imagePickerButton,
              {
                backgroundColor: hasImage ? colors.success + '20' : colors.card,
                borderColor: hasImage ? colors.success : colors.border,
              },
            ]}
            onPress={handleImagePicker}
          >
            <Text style={styles.imagePickerIcon}>{hasImage ? '🖼️' : '📷'}</Text>
            <View style={styles.imagePickerText}>
              <Text
                style={[styles.imagePickerTitle, { color: colors.textPrimary }]}
              >
                {hasImage ? 'Image Added' : 'Add Photo'}
              </Text>
              <Text
                style={[
                  styles.imagePickerSubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                {hasImage ? 'Tap to remove' : 'Share a photo with your post'}
              </Text>
            </View>
            <Text
              style={[styles.imagePickerArrow, { color: colors.textTertiary }]}
            >
              {hasImage ? '✓' : '›'}
            </Text>
          </TouchableOpacity>

          {/* Post Type Descriptions */}
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <Text style={styles.infoIcon}>💡</Text>
            <View style={styles.infoText}>
              <Text style={[styles.infoTitle, { color: colors.textPrimary }]}>
                {selectedType === 'Post' && 'Share Updates'}
                {selectedType === 'Poll' && 'Create a Poll'}
                {selectedType === 'Question' && 'Ask a Question'}
                {selectedType === 'Adoption' && 'Find Pet Homes'}
              </Text>
              <Text
                style={[
                  styles.infoDescription,
                  { color: colors.textSecondary },
                ]}
              >
                {selectedType === 'Post' &&
                  'Share thoughts, photos, and updates with your community'}
                {selectedType === 'Poll' &&
                  'Get community opinions on neighborhood topics with voting options'}
                {selectedType === 'Question' &&
                  'Ask the community for advice, recommendations, or local knowledge'}
                {selectedType === 'Adoption' &&
                  'Help pets find loving homes by sharing adoption opportunities'}
              </Text>
            </View>
          </View>

          {/* Preview Section */}
          {content.trim().length > 0 && (
            <View
              style={[styles.previewCard, { backgroundColor: colors.card }]}
            >
              <Text
                style={[styles.previewLabel, { color: colors.textSecondary }]}
              >
                Preview
              </Text>
              <View style={styles.previewHeader}>
                <Text style={styles.previewAvatar}>👤</Text>
                <View>
                  <Text
                    style={[
                      styles.previewAuthor,
                      { color: colors.textPrimary },
                    ]}
                  >
                    You
                  </Text>
                  <View style={styles.previewMeta}>
                    <Text
                      style={[styles.previewType, { color: colors.primary }]}
                    >
                      {POST_TYPE_ICONS[selectedType]} {selectedType}
                    </Text>
                    <Text
                      style={[
                        styles.previewTime,
                        { color: colors.textTertiary },
                      ]}
                    >
                      • Just now
                    </Text>
                  </View>
                </View>
              </View>
              <Text
                style={[styles.previewContent, { color: colors.textSecondary }]}
                numberOfLines={3}
              >
                {content}
              </Text>
              {hasImage && (
                <View
                  style={[
                    styles.previewImage,
                    { backgroundColor: colors.border },
                  ]}
                >
                  <Text style={styles.previewImageText}>🖼️ Image Preview</Text>
                </View>
              )}
            </View>
          )}

          {/* Character Counter */}
          <View style={styles.statsRow}>
            <Text style={[styles.charCount, { color: colors.textTertiary }]}>
              {content.length} characters
            </Text>
            {content.length > 500 && (
              <Text style={[styles.warningText, { color: colors.warning }]}>
                Long posts may be truncated in feed
              </Text>
            )}
          </View>

          {/* Bottom spacing */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
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
  headerButton: {
    padding: 4,
  },
  headerButtonText: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  postButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  postButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  typeSelector: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  typeSelectorLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  typePills: {
    marginHorizontal: -16,
  },
  typePillsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  typePillIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  typePillText: {
    fontSize: 15,
    fontWeight: '600',
  },
  inputSection: {
    padding: 16,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorAvatar: {
    fontSize: 28,
    marginRight: 8,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
  },
  textInput: {
    fontSize: 16,
    lineHeight: 22,
    minHeight: 120,
    padding: 0,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  imagePickerIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  imagePickerText: {
    flex: 1,
  },
  imagePickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  imagePickerSubtitle: {
    fontSize: 13,
  },
  imagePickerArrow: {
    fontSize: 20,
    marginLeft: 8,
  },
  infoCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  previewCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewAvatar: {
    fontSize: 28,
    marginRight: 10,
  },
  previewAuthor: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  previewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewType: {
    fontSize: 12,
    fontWeight: '600',
  },
  previewTime: {
    fontSize: 12,
    marginLeft: 4,
  },
  previewContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  previewImage: {
    height: 120,
    marginTop: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImageText: {
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  charCount: {
    fontSize: 12,
  },
  warningText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
