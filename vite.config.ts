import { resolve } from 'path';
import { UserConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

export default {
    plugins: [tsConfigPaths()],
    resolve: {
        alias: [
            {
                find: '@zeroconf/keyboard-navigation',
                replacement: resolve(__dirname, '../src'),
            },
        ],
    },
} satisfies UserConfig;
