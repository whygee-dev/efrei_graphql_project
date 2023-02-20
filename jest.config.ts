export default {
  displayName: 'graphql-api',
  globals: {
    'ts-jest': {
      isolatedModules: true,
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/libs/core',
  rootDir: '.',
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  testTimeout: 15000,
  projects: [
    {
      transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
      },
      testEnvironment: 'node',
      moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
      },
      displayName: 'INTEGRATION',
      runner: '@codejedi365/jest-serial-runner',
      testMatch: ['<rootDir>/**/*.integration.test.ts'],
      setupFilesAfterEnv: ['jest-extended/all'],
    },
  ],
};
