var webpack = require('webpack');

module.exports = {
  entry: './script.js',
  devtool: 'inline-source-map',
  output: {
    filename: 'compiled.js'
  },
  resolve: {
    extensions: ['', '.js']
  }
};
