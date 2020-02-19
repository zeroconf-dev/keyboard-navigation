import path from 'path';
import ts from 'typescript';

import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import prettier from 'rollup-plugin-prettier';
import replace from 'rollup-plugin-replace';
import typescript from 'rollup-plugin-ts';

const tsconfigOverride = {
    compilerOptions: {
        declaration: true,
        module: ts.ModuleKind.ES2015,
        target: ts.ScriptTarget.ES2015,
    },
    include: ['src/**/*.ts', 'src/**/*.tsx'],
    exclude: ['**/__tests__/*', '.docz', 'docs', 'examples', '**/node_modules/*', 'package', 'reports', 'src/stories'],
};

const plugins = [
    prettier({
        parser: 'typescript',
    }),
    replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    typescript({
        transpiler: 'typescript',
        tsconfig: {
            fileName: './tsconfig.json',
            hook: resolvedConfig => ({
                ...resolvedConfig,
                ...tsconfigOverride.compilerOptions,
            }),
        },
        exclude: tsconfigOverride.exclude,
        include: tsconfigOverride.include,
    }),
    nodeResolve({ browser: true }),
    commonjs(),
];

const outputOptions = {
    banner: '// @ts-nocheck',
    preferConst: true,
    // sourcemap: true,
    // sourcemapExcludeSources: true,
    strict: true,
    sourcemapPathTransform: relativePath => {
        if (relativePath.indexOf('/node_modules/') !== 1) {
            return path.relative('../../', relativePath);
        } else {
            return path.relative('../../src/', relativePath);
        }
    },
};

export default [
    {
        context: 'window',
        input: 'src/util.ts',
        output: [
            {
                file: 'package/build/util.js',
                name: '@zeroconf/keyboard-navigation/util',
                ...outputOptions,
            },
        ],
        plugins: plugins,
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
                banner: '// @ts-nocheck',
                file: 'package/build/index.js',
                name: '@zeroconf/keyboard-navigation/hotkeys',
                ...outputOptions,
            },
        ],
        plugins: plugins,
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
                banner: '// @ts-nocheck',
                file: 'package/build/hooks.js',
                name: '@zeroconf/keyboard-navigation/hooks',
                ...outputOptions,
            },
        ],
        plugins: plugins,
        treeshake: {
            moduleSideEffects: false,
        },
    },
    {
        context: 'window',
        external: ['react', 'react-dom', '@zeroconf/keyboard-navigation/util'],
        input: 'src/classic.ts',
        output: [
            {
                banner: '// @ts-nocheck',
                file: 'package/build/classic.js',
                name: '@zeroconf/keyboard-navigation',
                ...outputOptions,
            },
        ],
        plugins: plugins,
        treeshake: {
            moduleSideEffects: false,
        },
    },
];
