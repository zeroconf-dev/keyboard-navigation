import fs from 'fs';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import ts from 'rollup-plugin-ts';

const tsconfig = JSON.parse(fs.readFileSync('./tsconfig.json').toString());
const tsconfigOverride = {
    compilerOptions: {
        declaration: true,
        module: 'es2015',
        target: 'es2018',
    },
    exclude: ['**/__tests__/*', '.docz', 'build', 'docs', 'examples', 'node_modules', 'package', 'reports'],
};

export default [
    {
        context: 'window',
        input: 'src/util.ts',
        output: [
            {
                file: 'build/util.js',
                name: '@zeroconf/keyboard-navigation/util',
            },
        ],
        plugins: [
            resolve({}),
            commonjs(),
            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
            }),
            ts({
                tsconfig: {
                    ...tsconfig.compilerOptions,
                    ...tsconfigOverride.compilerOptions,
                },
                exclude: tsconfigOverride.exclude,
            }),
        ],
    },
    {
        context: 'window',
        external: [
            'react',
            'react-dom',
            '@zeroconf/keyboard-navigation',
            '@zeroconf/keyboard-navigation/hotkeys',
            '@zeroconf/keyboard-navigation/hotkeys/parser',
            '@zeroconf/keyboard-navigation/util',
        ],
        input: 'src/hooks.ts',
        output: [
            {
                file: 'build/hooks.js',
                name: '@zeroconf/keyboard-navigation/hooks',
            },
        ],
        plugins: [
            resolve({}),
            commonjs(),
            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
            }),
            ts({
                tsconfig: {
                    ...tsconfig.compilerOptions,
                    ...tsconfigOverride.compilerOptions,
                },
                exclude: tsconfigOverride.exclude,
            }),
        ],
    },
    {
        context: 'window',
        external: [
            'react',
            'react-dom',
            '@zeroconf/keyboard-navigation',
            '@zeroconf/keyboard-navigation/hooks',
            '@zeroconf/keyboard-navigation/hotkeys/parser',
            '@zeroconf/keyboard-navigation/util',
        ],
        input: 'src/hotkeys.ts',
        output: [
            {
                file: 'build/hotkeys.js',
                name: '@zeroconf/keyboard-navigation/hotkeys',
            },
        ],
        plugins: [
            resolve({}),
            commonjs(),
            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
            }),
            ts({
                tsconfig: {
                    ...tsconfig.compilerOptions,
                    ...tsconfigOverride.compilerOptions,
                },
                exclude: tsconfigOverride.exclude,
            }),
        ],
    },
    {
        context: 'window',
        external: [
            'react',
            'react-dom',
            'prop-types',
            '@zeroconf/keyboard-navigation/hooks',
            '@zeroconf/keyboard-navigation/hotkeys/parser',
            '@zeroconf/keyboard-navigation/hotkeys',
            '@zeroconf/keyboard-navigation/util',
        ],
        input: 'src/index.ts',
        output: [
            {
                file: 'build/index.js',
                name: '@zeroconf/keyboard-navigation',
            },
        ],
        plugins: [
            resolve({}),
            commonjs(),
            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
            }),
            ts({
                tsconfig: {
                    ...tsconfig.compilerOptions,
                    ...tsconfigOverride.compilerOptions,
                },
                exclude: tsconfigOverride.exclude,
            }),
        ],
    },
    // {
    //     context: 'window',
    //     input: 'src/index.ts',
    //     external: ['react', 'react-dom', 'prop-types'],
    //     output: [
    //         {
    //             file: 'package/dist/keyboard-navigation.amd.js',
    //             format: 'amd',
    //             globals: {
    //                 '@zeroconf/keyboard-navigation/hotkeys/parser': 'parser',
    //                 'prop-types': 'PropTypes',
    //                 react: 'React',
    //                 'react-dom': 'ReactDOM',
    //             },
    //             name: '@zeroconf/keyboard-navigation',
    //         },
    //         {
    //             file: 'package/dist/keyboard-navigation.umd.js',
    //             format: 'umd',
    //             globals: {
    //                 '@zeroconf/keyboard-navigation/hotkeys/parser': 'parser',
    //                 'prop-types': 'PropTypes',
    //                 react: 'React',
    //                 'react-dom': 'ReactDOM',
    //             },
    //             name: '@zeroconf/keyboard-navigation',
    //         },
    //     ],
    //     plugins: [
    //         resolve({}),
    //         commonjs(),
    //         replace({
    //             'process.env.NODE_ENV': JSON.stringify('production'),
    //         }),
    //         typescript(
    //             Object.assign({}, tsconfig.compilerOptions, {
    //                 isolatedModules: true,
    //                 module: 'es2015',
    //                 target: 'es2015',
    //             }),
    //         ),
    //     ],
    // },
];
