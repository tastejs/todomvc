var path = require('path');

module.exports = {
	context: __dirname,
	entry: './src/todo.jsx',
	output: {
		path: path.resolve(__dirname),
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{
				test: [/\.jsx?$/, /\.js?$/],
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['env', 'react']
				}
			}
		]
	},
	devtool: 'source-map',
	resolve: {
		extensions: ['.js', '.jsx', '*']
	}
};
