export default {
    base: '/keyboard-navigation',
    dest: './docs',
    htmlContext: {
        head: {
            links: [
                {
                    rel: 'stylesheet',
                    href: 'https://codemirror.net/theme/dracula.css',
                },
            ],
        },
    },
    indexHtml: './src/docs/index.html',
    plugins: [],
    src: './src',
    themeConfig: {
        codemirrorTheme: 'dracula',
        colors: {
            primary: 'tomato',
        },
        showPlaygroundEditor: true,
    },
    title: 'Keyboard Navigation - Docs - Zeroconf OSS',
    typescript: true,
};
