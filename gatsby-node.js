// @ts-nocheck
// eslint-disable-next-line
const TSPathsPlugin = require('tsconfig-paths-webpack-plugin');

exports.onCreateWebpackConfig = ({ actions }) => {
    actions.setWebpackConfig({
        resolve: {
            plugins: [new TSPathsPlugin({ configFile: '../tsconfig.json' })],
        },
    });
};
