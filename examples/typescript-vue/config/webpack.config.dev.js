const webpackBaseConfig = require('./webpack.config.base');
const env = require('../environment/dev.env');
const webpack = require('webpack')
const path = require('path');
const helpers = require('./helpers');
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const autoprefixer = require('autoprefixer');

const webpackDevConfig = {
  module: {
    rules: [{
      test: /\.s?css$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader',
        options: {
          minimize: false,
          sourceMap: true,
          importLoaders: 2
        }
      }, {
        loader: 'postcss-loader',
        options: {
          plugins: () => [autoprefixer],
          sourceMap: true
        }
      }, {
        loader: 'sass-loader',
        options: {
          outputStyle: 'expanded',
          sourceMap: true,
          sourceMapContents: true
        }
      }
      ],
    }, {
      test: /\.(jpe?g|png|ttf|eot|svg|ico|woff(2)?)(\?[a-z0-9=&.]+)?$/,
      use: 'base64-inline-loader?limit=1000&name=[name].[ext]'
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: helpers.root('/src/index.html'),
      filename: 'index.html'
    }),
    new DefinePlugin({
      'process.env': env
    }),
    new FriendlyErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 7000,
    historyApiFallback: true,
    hot: true,
    quiet: true,
    open: true,
    inline: true
  },
  devtool: 'cheap-module-eval-source-map'
}

const devExport = merge(webpackBaseConfig, webpackDevConfig);

module.exports = devExport;