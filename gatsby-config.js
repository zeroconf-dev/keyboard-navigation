module.exports = {
    plugins: [
        {
            resolve: 'gatsby-plugin-typescript',
            options: {
                isTSX: true,
                jsxPragma: 'React',
                allExtensions: true,
            },
        },
        'gatsby-theme-docz',
    ],
};
