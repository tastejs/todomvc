const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const rootFolder = path.join(__dirname, './');
const srcPath = path.resolve(rootFolder, 'src');

const WebpackConfig = {
	entry: './src/index.js',
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './dist',
		port: 3000,
		host: 'localhost',
		hot: true
	},
	resolve: {
		alias: {
			'@app-actions': `${ srcPath }/js/actions`,
			'@app-components': `${ srcPath }/js/components`,
			'@app-libs': `${ srcPath }/js/libs`,
			'@app-stores': `${ srcPath }/js/stores`,
			'@app-styles': `${ srcPath }/styles`,
			'@app-views': `${ srcPath }/js/views`
		}
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							"@babel/env"
						],
						plugins: [
							"@babel/plugin-proposal-class-properties",
							"@babel/plugin-transform-object-assign"
						]
					}
				}
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				use: [{
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'fonts/'
					}
				}]
			}
		]
	},
	mode: 'development',
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			title: '',
			templateContent: '<!doctype html><html lang="en" data-framework="backbonejs"><body></body></html>'
		}),
		new webpack.HotModuleReplacementPlugin()
	],
	output: {
		filename: '[name].main.js',
		path: path.resolve(__dirname, '/dist'),
		publicPath: '/'
	}
};

module.exports = WebpackConfig;
