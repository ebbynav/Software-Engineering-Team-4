# Placeholder Images

This directory contains placeholder images used throughout the app to prevent layout shift and improve perceived performance.

## Image Specifications

### placeholder-route.png

- **Dimensions**: 800×600px (4:3 aspect ratio)
- **Usage**: Route card images, map previews
- **Background**: Light gray (#E5E7EB)
- **Content**: Simple route icon or path illustration

### placeholder-news.png

- **Dimensions**: 400×400px (1:1 aspect ratio)
- **Usage**: News article thumbnails
- **Background**: Light blue-gray (#E0E7FF)
- **Content**: Newspaper or article icon

### placeholder-avatar.png

- **Dimensions**: 200×200px (1:1 aspect ratio)
- **Usage**: User profile avatars
- **Background**: Light purple (#EDE9FE)
- **Content**: Generic user silhouette

### placeholder-map.png

- **Dimensions**: 800×400px (2:1 aspect ratio)
- **Usage**: Map thumbnails, location previews
- **Background**: Light teal (#CCFBF1)
- **Content**: Simple map grid pattern

## Implementation Notes

1. **Always specify dimensions**: Prevents layout shift during image loading
2. **Use defaultSource prop**: Provides immediate visual feedback
3. **Consistent styling**: All placeholders use same border radius and styling
4. **Accessible labels**: Include descriptive accessibilityLabel for screen readers

## Usage Example

```tsx
import placeholderRoute from '@/assets/placeholder-route.png';

<Image
  source={{ uri: imageUrl }}
  style={{ width: 400, height: 300 }}
  defaultSource={placeholderRoute}
  accessibilityLabel="Route preview image"
/>;
```

## Creating Placeholder Images

If you need to regenerate or create new placeholders:

1. Use design tools (Figma, Sketch) or online generators
2. Maintain consistent dimensions as specified above
3. Export at 2x resolution for retina displays
4. Optimize file size (< 50KB per image)
5. Use PNG format with transparency support

## Fallback Colors

If images fail to load, these colors are used as backgrounds:

- Routes: #E5E7EB (Gray 200)
- News: #E0E7FF (Indigo 100)
- Avatars: #EDE9FE (Purple 100)
- Maps: #CCFBF1 (Teal 100)
