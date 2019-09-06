module.exports = {
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.test.json',
        },
    },
    moduleDirectories: ['node_modules'],
    modulePathIgnorePatterns: ['<rootDir>/build','<rootDir>/.docz','<rootDir>/package'],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
    preset: 'ts-jest',
    testPathIgnorePatterns: ['/node_modules/', '/__helpers__/'],
};
