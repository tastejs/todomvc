'use strict';
let webpack = require('webpack');

module.exports = {
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel',
				exclude: /node_modules/,
				query: {
					presets: ['es2015', 'angular2']
				}
			},
			{
				test: /\.html$/,
				loader: 'raw'
			}
		]
	},

	plugins: [
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		})
	],

	devtool: 'source-map'
};
