module.exports = {
    globals: {
        'ts-jest': {
            tsConfigFile: 'tsconfig.test.json',
        },
    },
    moduleDirectories: ['node_modules'],
    modulePathIgnorePatterns: ['<rootDir>/build', '<rootDir>/.next'],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
    testRegex: '/__tests__/.*\\.(ts|tsx)$',
    transform: {
        '^.+\\.tsx?$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
    },
};
