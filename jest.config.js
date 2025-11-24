module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.module.ts',
    '!**/*.interface.ts',
    '!**/*.dto.ts',
    '!**/main.ts',
    '!**/data-source.ts',
    '!**/migrations/**',
    '!**/*.entity.ts',
    '!**/index.ts',
    '!**/controllers/**',
    '!**/repositories/**',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/core/$1',
    '^@external/(.*)$': '<rootDir>/external/$1',
    '^@common/(.*)$': '<rootDir>/common/$1',
  },
};
