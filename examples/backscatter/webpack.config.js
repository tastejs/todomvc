var path = require('path'),
	webpack = require('webpack');

module.exports = {
	context: path.join(__dirname, "/js"),
	entry: "./bootstrap",
	output: {
		path: __dirname,
		filename: "app.js"
	},
	module: {
		loaders: [
			{ test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader" },
			{ test: /backbone\.js$/, loader: 'imports?define=>false' }
		]
	},
	plugins: [
		new webpack.IgnorePlugin(/^jquery$/)
	],
	resolve: {
		extensions: ['', '.js', '.jsx']
	}

};
