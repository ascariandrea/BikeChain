// jest.config.js
const { defaults: tsjPreset } = require('ts-jest/presets');

const transformIgnoreDeps = [
  'react-native',
  'react-navigation',
  'native-base-shoutem-theme',
  'react-native-easy-grid',
  'react-native-drawer',
  'react-native-vector-icons',
  'react-native-keyboard-aware-scroll-view',
  'react-native-iphone-x-helper',
  'react-native-fs',
  'react-native-ble-plx',
  '@react-navigation',
  'react-navigation-tabs',
  'react-native-screens',
  'react-navigation-stack',
  'react-native-gesture-handler'
];

const jestConfig = {
  preset: 'react-native',
  modulePathIgnorePatterns: ['<rootDir>/__mocks__/mocks.ts'],
  transform: {
    '\\.(js|jsx)$': '<rootDir>/node_modules/react-native/jest/preprocessor.js',
    ...tsjPreset.transform
  },
  testPathIgnorePatterns: [
    '\\.snap$',
    '<rootDir>/build/',
    '<rootDir>/node_modules/'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(' + transformIgnoreDeps.join('|') + ')/)'
  ],
  globals: {
    'ts-jest': {
      babelConfig: false
    }
  },
  // This is the only part which you can keep
  // from the above linked tutorial's config:
  cacheDirectory: '.jest/cache',
  verbose: true
};

module.exports = jestConfig;
