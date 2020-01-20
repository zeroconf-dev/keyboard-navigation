import fs from 'fs';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import ts from 'rollup-plugin-typescript';
// import typescript from 'typescript';

const tsconfig = JSON.parse(fs.readFileSync('./tsconfig.json').toString());

export default {
    context: 'window',
    input: 'src/index.ts',
    external: ['react', 'react-dom', 'prop-types'],
    output: [
        {
            file: 'package/dist/keyboard-navigation.amd.js',
            format: 'amd',
            globals: {
                'prop-types': 'PropTypes',
                react: 'React',
                'react-dom': 'ReactDOM',
            },
            name: '@zeroconf/keyboard-navigation',
        },
        {
            file: 'package/dist/keyboard-navigation.umd.js',
            format: 'umd',
            globals: {
                'prop-types': 'PropTypes',
                react: 'React',
                'react-dom': 'ReactDOM',
            },
            name: '@zeroconf/keyboard-navigation',
        },
    ],
    plugins: [
        resolve(),
        commonjs({
            include: 'src/hotkeys/parser.js',
            namedExports: {
                '@zeroconf/keyboard-navigation/hotkeys/parser': ['parse', 'parser', 'Parser'],
            },
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        ts(
            Object.assign({}, tsconfig.compilerOptions, {
                isolatedModules: true,
                module: 'es2015',
                target: 'es2015',
            }),
        ),
    ],
};
