module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-native-community|@react-navigation|@notifee/react-native|react-native-reanimated|react-native-linear-gradient|react-native-mmkv|react-native-geolocation-service)/)',
  ],
};
