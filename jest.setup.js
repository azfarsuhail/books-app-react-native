module.exports = {
  registerRootComponent: jest.fn(),
  requireNativeModule: jest.fn(),

  ...jest
};

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('expo-image', () => ({ Image: 'Image' }));
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    dismissAll: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Stack: {
    Screen: () => null,
  },
}));

const originalConsoleError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('was not wrapped in act')) {
    return;
  }
  originalConsoleError(...args);
};