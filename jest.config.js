export default {
  rootDir: './edueasy-venture-refresh',
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom', // Use jsdom for React component tests
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      { useESM: true }
    ]
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^(\.{1,2}/.*)\\.js$': '$1',
  },
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.app.json'
    }
  }
};
// Set rootDir to the nested edueasy-venture-refresh for correct alias resolution.
// Set testEnvironment to jsdom for React, and map @/ to src/ for imports.
