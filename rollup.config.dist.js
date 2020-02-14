import fs from 'fs';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-ts';

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
                preferConst: true,
                strict: true,
            },
        ],
        plugins: [
            resolve({}),
            commonjs(),
            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
            }),
            typescript({
                tsconfig: {
                    ...tsconfig.compilerOptions,
                    ...tsconfigOverride.compilerOptions,
                },
                exclude: tsconfigOverride.exclude,
            }),
        ],
        treeshake: {
            moduleSideEffects: false,
        },
    },
    {
        context: 'window',
        external: ['react', 'react-dom', '@zeroconf/keyboard-navigation/util'],
        input: 'src/index.ts',
        output: [
            {
                file: 'build/index.js',
                name: '@zeroconf/keyboard-navigation',
                preferConst: true,
                strict: true,
            },
        ],
        plugins: [
            resolve({}),
            commonjs(),
            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
            }),
            typescript({
                tsconfig: {
                    ...tsconfig.compilerOptions,
                    ...tsconfigOverride.compilerOptions,
                },
                exclude: tsconfigOverride.exclude,
            }),
        ],
        treeshake: {
            moduleSideEffects: false,
        },
    },
    {
        context: 'window',
        external: ['react', 'react-dom', '@zeroconf/keyboard-navigation/util'],
        input: 'src/hotkeys.ts',
        output: [
            {
                file: 'build/hotkeys.js',
                name: '@zeroconf/keyboard-navigation/hotkeys',
                preferConst: true,
                strict: true,
            },
        ],
        plugins: [
            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
            }),
            typescript({
                exclude: tsconfigOverride.exclude,
                include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.js'],
                tsconfig: {
                    ...tsconfig.compilerOptions,
                    ...tsconfigOverride.compilerOptions,
                    allowJs: true,
                },
            }),
            resolve({
                browser: true,
            }),
            commonjs(),
        ],
        treeshake: {
            moduleSideEffects: false,
        },
    },
    {
        context: 'window',
        external: ['react', 'react-dom', '@zeroconf/keyboard-navigation/util'],
        input: 'src/hooks.ts',
        output: [
            {
                file: 'build/hooks.js',
                name: '@zeroconf/keyboard-navigation/hooks',
                preferConst: true,
                strict: true,
            },
        ],
        plugins: [
            resolve(),
            commonjs(),
            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
            }),
            typescript({
                tsconfig: {
                    ...tsconfig.compilerOptions,
                    ...tsconfigOverride.compilerOptions,
                },
                exclude: tsconfigOverride.exclude,
            }),
        ],
        treeshake: {
            moduleSideEffects: false,
        },
    },
];
