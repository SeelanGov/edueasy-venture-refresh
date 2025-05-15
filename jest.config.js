export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: {},
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^(\.{1,2}/.*)\\.js$': '$1',
  },
};
