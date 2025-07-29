export default {
  rootDir: '.',
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom', // Use jsdom for React component tests
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true }],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^(\.{1,2}/.*)\\.js$': '$1',
  },
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.app.json',
    },
  },
};
// Jest configuration for React testing with TypeScript support
