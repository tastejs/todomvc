import svelte from 'rollup-plugin-svelte';
import buble from 'rollup-plugin-buble';
import closure from 'rollup-plugin-closure-compiler-js';
import filesize from 'rollup-plugin-filesize';

// you can use UglifyJS instead of Closure — the result will be ~3.3kb
// import uglify from 'rollup-plugin-uglify';

const plugins = [ svelte() ];
if ( process.env.production ) {
	plugins.push(
		buble(),
		closure({
			compilationLevel: 'ADVANCED'
		}),
		filesize()
	);
}

export default {
	entry: 'src/main.js',
	dest: 'public/bundle.js',
	format: 'iife',
	plugins,
	sourceMap: true
};
