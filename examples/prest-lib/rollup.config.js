import typescript from 'rollup-plugin-typescript';
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-js';

const pkg = require('./package.json');

export default {
    entry: './src/index.ts',
    plugins: [
        typescript({
            typescript: require('typescript')
        }),
        replace({
            '@VERSION@': pkg.version
        }),
        uglify({}, minify)
    ],
    external: Object.keys(pkg.dependencies),
    targets: [
        {
            dest: './js/index.js',
            format: 'iife',
            sourceMap: true
        }
    ]
}
