import commonjs from 'rollup-plugin-commonjs';
import fs from 'fs';
import path from 'path';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import ts from 'rollup-plugin-ts';
import typescript from 'typescript';

const tsconfig = JSON.parse(fs.readFileSync('./tsconfig.json').toString());
const entry = process.argv[process.argv.length - 1];

if (!entry.startsWith('examples')) {
    console.error('Usage: yarn build:example -- path/to/example/entry/main.tsx');
    process.exit(1);
}
export default {
    context: 'window',
    input: path.resolve(entry),
    output: {
        file: path.resolve(path.dirname(entry), 'bundle.js'),
        format: 'iife',
        external: ['react', 'react-dom', 'prop-types'],
        globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'prop-types': 'PropTypes',
        },
        name: 'example',
    },
    plugins: [
        'external-helpers',
        replace({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        resolve(),
        ts({
            exclude: tsconfig.exclude,
            include: ['src/*.tsx', 'src/**/*.tsx', 'src/*.ts', 'src/**/*.ts', entry],
            typescript: typescript,
            tsconfig: Object.assign({}, tsconfig.compilerOptions, {
                target: 'es2015',
            }),
        }),
        commonjs({
            include: 'node_modules/**',
            namedExports: {
                'node_modules/react/index.js': ['Component', 'createContext', 'createElement', 'Fragment'],
                'node_modules/react-dom/index.js': ['render'],
            },
        }),
    ],
};
