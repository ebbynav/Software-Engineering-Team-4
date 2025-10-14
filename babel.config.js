module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Conditionally include nativewind/babel and reanimated only for native platforms
      ...(process.env.EXPO_PLATFORM !== 'web' ? ['nativewind/babel', 'react-native-reanimated/plugin'] : []),
    ],
  };
};
