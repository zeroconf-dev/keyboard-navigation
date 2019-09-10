const path = require('path');

module.exports = ({ config }) => {
    config.resolve.alias['@zeroconf/keyboard-navigation'] = path.resolve(__dirname, '../src/');
    config.resolve.extensions.push('.ts', '.tsx');
    config.module.rules.push({
        test: /\.tsx?$/,
        use: ['ts-loader', 'react-docgen-typescript-loader'],
    });
    return config;
};
