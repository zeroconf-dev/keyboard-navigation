export default {
    base: '/keyboard-navigation',
    dest: './docs',
    filterComponents: files =>
        //This overrides the default filtering of components
        files.filter(filepath => /[w-]*.(js|jsx|ts|tsx)$/.test(filepath)),
    indexHtml: './src/docs/index.html',
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
    src: './src',
    themeConfig: {
        codemirrorTheme: 'dracula',
        colors: {
            primary: 'tomato',
        },
        showPlaygroundEditor: true,
    },
    title: 'Keyboard Navigation - Zeroconf OSS',
    typescript: true,
};
