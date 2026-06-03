// Mock native modules for Jest testing environment

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('react-native-mmkv', () => {
  return {
    createMMKV: jest.fn().mockImplementation(() => ({
      set: jest.fn(),
      getString: jest.fn(),
      getNumber: jest.fn(),
      getBoolean: jest.fn(),
      remove: jest.fn(),
      clearAll: jest.fn(),
    })),
  };
});

jest.mock('@notifee/react-native', () => {
  return {
    requestPermission: jest.fn().mockResolvedValue({ authorizationStatus: 1 }),
    cancelAllNotifications: jest.fn().mockResolvedValue(undefined),
    createChannel: jest.fn().mockResolvedValue('default'),
    createTriggerNotification: jest.fn().mockResolvedValue('notification-id'),
    TriggerType: {
      TIMESTAMP: 0,
      INTERVAL: 1,
    },
    AndroidImportance: {
      HIGH: 4,
    },
  };
});

jest.mock('react-native-geolocation-service', () => {
  return {
    requestAuthorization: jest.fn().mockResolvedValue('granted'),
    getCurrentPosition: jest.fn().mockImplementation((success) => {
      success({
        coords: {
          latitude: 23.0225,
          longitude: 72.5714,
        },
      });
    }),
  };
});

jest.mock('@react-native-community/blur', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    BlurView: ({ children, ...props }) => React.createElement(View, props, children),
  };
});

jest.mock('react-native-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return ({ children, ...props }) => React.createElement(View, props, children);
});
