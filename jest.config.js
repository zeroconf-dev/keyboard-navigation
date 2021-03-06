module.exports = {
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.test.json',
        },
    },
    coverageDirectory: '<rootDir>/reports/coverage',
    moduleDirectories: ['node_modules'],
    moduleNameMapper: {
        '@zeroconf/keyboard-navigation$': '<rootDir>/src/index',
        '@zeroconf/keyboard-navigation/(.*)': '<rootDir>/src/$1',
    },
    modulePathIgnorePatterns: ['<rootDir>/build', '<rootDir>/.docz', '<rootDir>/package'],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
    preset: 'ts-jest/presets/js-with-ts',
    reporters: [
        'default',
        [
            'jest-junit',
            {
                outputDirectory: '<rootDir>/reports/junit',
                outputName: 'js-test-results.xml',
            },
        ],
    ],
    testMatch: ['**/__tests__/**/?(*.)+(test).ts?(x)'],
};
