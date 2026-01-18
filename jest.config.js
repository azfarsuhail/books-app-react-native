module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|expo-router|expo-font|expo-asset|expo-modules-core)'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    'expo/src/winter': '<rootDir>/jest.setup.js',
    '^expo$': '<rootDir>/jest.setup.js',
    '^expo-modules-core$': '<rootDir>/jest.setup.js',
  }
};