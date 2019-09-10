const path = require('path');
exports.onCreateWebpackConfig = ({ actions }) => {
    console.log('setting up alias');
    actions.setWebpackConfig({
        resolve: {
            alias: {
                '@zeroconf/keyboard-navigation': path.resolve(__dirname, '../src/'),
            },
            extensions: ['ts', 'tsx'],
        },
    });
};
