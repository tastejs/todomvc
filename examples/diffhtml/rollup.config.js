import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import alias from 'rollup-plugin-import-alias';
import ignore from 'rollup-plugin-ignore';
import buble from 'rollup-plugin-buble';
import Visualizer from 'rollup-plugin-visualizer';

const { NODE_ENV = 'umd' } = process.env;

export const exports = 'none';
export const context = 'this';
export const entry = 'lib/index.js';
export const sourceMap = false;

export const targets = [{
	dest: 'dist/todomvc.js',
	format: 'umd'
}];

export const plugins = [
	NODE_ENV === 'production' && replace({
		'process.env.NODE_ENV': JSON.stringify('production')
	}),
	NODE_ENV === 'production' && ignore(['prop-types']),
	alias({
		Paths: {
			diffhtml: './node_modules/diffhtml/dist/es/runtime'
		},
		Extensions: ['js']
	}),
	babel(),
	buble(),
	nodeResolve({ jsnext: true }),
	commonjs(),
	Visualizer({ filename: './dist/build-size.html' })
];
