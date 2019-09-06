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
                react: 'React',
                'react-dom': 'ReactDOM',
                'prop-types': 'PropTypes',
            },
            name: 'keyboard-navigation',
        },
        {
            file: 'package/dist/keyboard-navigation.umd.js',
            format: 'umd',
            globals: {
                react: 'React',
                'react-dom': 'ReactDOM',
                'prop-types': 'PropTypes',
            },
            name: 'keyboard-navigation',
        },
    ],
    plugins: [
        commonjs({
            namedExports: {
                'hotkeys/parser': ['parse'],
            },
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        resolve(),
        ts(
            Object.assign({}, tsconfig.compilerOptions, {
                isolatedModules: true,
                module: 'es2015',
                target: 'es2015',
            }),
        ),
    ],
};
