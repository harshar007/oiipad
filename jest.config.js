/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/packages', '<rootDir>/apps/pc-server', '<rootDir>/tests'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@oiipad/domain$': '<rootDir>/packages/domain/src/index.ts',
    '^@oiipad/protocol$': '<rootDir>/packages/protocol/src/index.ts',
    '^@oiipad/shared-types$': '<rootDir>/packages/shared-types/src/index.ts'
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: false,
        tsconfig: '<rootDir>/tsconfig.json'
      }
    ]
  },
  testMatch: ['**/*.spec.ts', '**/*.test.ts']
};
