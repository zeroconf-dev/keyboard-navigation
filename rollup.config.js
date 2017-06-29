import resolve from 'rollup-plugin-node-resolve';
import ts from 'rollup-plugin-ts';
import typescript from 'typescript';
const tsconfig = require('./tsconfig.json');

export default {
    context: 'window',
    entry: 'src/index.ts',
    external: ['react', 'react-dom', 'prop-types'],
    globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'prop-types': 'PropTypes',
    },
    plugins: [
        resolve(),
        ts({
            exclude: tsconfig.exclude,
            typescript: typescript,
            tsconfig: Object.assign({}, tsconfig.compilerOptions, {
                target: 'es2015',
            }),
        }),
    ],
    targets: [
        {
            dest: 'dist/bundle.amd.js',
            format: 'amd',
            moduleName: 'tab-navigation',
        },
        {
            dest: 'dist/bundle.umd.js',
            format: 'umd',
            moduleName: 'tab-navigation',
        },
    ],
};
