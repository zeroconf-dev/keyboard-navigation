import { css } from 'docz-plugin-css';

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
    plugins: [
        css({
            preprocessor: 'less',
        }),
    ],
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
