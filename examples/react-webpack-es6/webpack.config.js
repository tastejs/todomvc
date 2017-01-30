
module.exports = {
	resolve: {
		extensions: ['', '.jsx', '.js', 'es6']
	},
	entry:  './es6/app.es6',
	output: {
		path: './build',
		filename:'app.js'
	},
	module: {
		loaders: [
			{
				test: /(\.js|\.jsx|\.es6)$/,
				loader: 'babel',
				query: { presets: ['babel-preset-es2015', 'babel-preset-stage-0', 'babel-preset-react'] }
			}
		]
	}
};
