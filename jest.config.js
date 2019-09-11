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
    modulePathIgnorePatterns: ['<rootDir>/build','<rootDir>/.docz','<rootDir>/package'],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
    preset: 'ts-jest',
    reporters: ['default', 'jest-junit'],
    testPathIgnorePatterns: ['/node_modules/', '/__helpers__/'],
};
