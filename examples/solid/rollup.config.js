import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

const production = process.env.NODE_ENV === 'production';

export default {
	input: 'src/index.js',
	output: {
		file: 'bundle.js',
		format: 'iife',
		sourcemap: !production
	},
	watch: {
		include: ['./src/**']
	},
	plugins: [
		nodeResolve({
      mainFields: ['module', 'main', 'browser'],
      dedupe: ['solid-js'],
      preferBuiltins: true,
			extensions: ['.js', '.jsx']
    }),
		commonjs({
      include: 'node_modules/**'
    }),
		babel(),
		production && terser()
	].filter(Boolean)
}
