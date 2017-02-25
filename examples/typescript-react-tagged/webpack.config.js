module.exports = {
	entry: './ts_build/app/index.js',
	output: {
		filename: './build/app.js'
	},
	resolve: {
		extensions: ['.webpack.js', '.web.js', '.ts', '.js']
	}
};
