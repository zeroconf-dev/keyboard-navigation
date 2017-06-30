import path from 'path';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

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
        'external-helpers',
        replace({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        resolve(),
        typescript({
            tsconfig: path.resolve('tsconfig.lib2015.json'),
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
