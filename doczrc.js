import { css } from 'docz-plugin-css';

export default {
    base: '/tab-navigation.ts',
    dest: 'docs',
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
    title: 'TabNavigation.ts',
    typescript: true,
};
