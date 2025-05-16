export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      { useESM: true }
    ]
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^(\.{1,2}/.*)\\.js$': '$1',
  },
};
// Cleaned up config: moved ts-jest options into transform, removed deprecated and unknown keys.
