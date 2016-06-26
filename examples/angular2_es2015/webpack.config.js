'use strict';

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

	devtool: false
};
