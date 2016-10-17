'use strict';

var path = require('path');

module.exports = {

	// The application entry point
	entry: './js/index.jsx',

	output: {
		// Sets the output path to the absolute of ./dist
		path: path.join(__dirname, 'dist'),

		// The output bundle filename
		filename: 'index.js'
	},

	// Creates source-maps on our bundle
	devtool: 'source-map',

	resolve: {
		// When importing 'my-dependency' searches for 'my-dependency' itself,
		// then 'my-dependency.webpack.js', ... , then 'my-dependency.jsx'
		extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
	},
	module: {
		// Loaders allows to preprocess files when importing them
		loaders: [
			// JS and JSX files are loaded by babel with ES6 and react plugins
			{
				test: /\.(js|jsx)$/,
				loader: 'babel-loader',
				query: {
					presets: [
						'es2015',
						'stage-0',
						'react'
					]
				}
			}
		]
	}
}
