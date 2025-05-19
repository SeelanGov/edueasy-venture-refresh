export default {
  rootDir: './edueasy-venture-refresh',
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
