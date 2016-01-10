'use strict';
let path = require('path');
let webpack = require('webpack');

module.exports = {
	entry: {
		boot: './client/boot.js',
		vendor: './client/vendor.js'
	},
	output: {
		path: __dirname,
		filename: '[name].bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel',
				exclude: /node_modules/,
				query: {
					presets: ['es2015'],
					plugins: [
						'angular2-annotations',
						'transform-decorators-legacy',
						'transform-class-properties',
						'transform-flow-strip-types'
					]
				}
			},
			{
				test: /\.html$/,
				loader: 'html?minimize=false'
			}
		]
	},

	resolve: {
		root: __dirname,
		extensions: ['', '.js', '.json']
	},

	plugins: [
		new webpack.DefinePlugin({
			ENVIRONMENT: JSON.stringify('development')
		}),
		new webpack.optimize.CommonsChunkPlugin(
			'vendor', 'vendor.bundle.js'
		)
	],

	devtool: false
};
