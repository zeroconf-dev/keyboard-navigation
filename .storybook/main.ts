import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';
import { mergeConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const config: StorybookConfig = {
    addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
    core: {
        builder: '@storybook/builder-vite',
    },
    docs: {
        autodocs: 'tag',
    },
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
    stories: ['../src/**/*.stories.@(ts|tsx)'],
    typescript: {
        check: false,
        reactDocgen: 'react-docgen',
    },
    viteFinal: (config) => {
        console.log(path.resolve(__dirname, '../src'));
        return mergeConfig(config, {
            plugins: [tsconfigPaths()],
            resolve: {
                alias: [
                    {
                        find: '@zeroconf/keyboard-navigation',
                        replacement: path.resolve(__dirname, '../src'),
                    },
                ],
            },
        });
    },
};
export default config;
