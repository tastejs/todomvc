const path = require('path');
const helpers = require('./helpers');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const baseConfig = {
  entry: {
    'bundle': helpers.root('/src/main.ts')
  },
  output: {
    filename: '[name].js',
    publicPath: '/',
    path: helpers.root('dist')
  },
  resolve: {
    extensions: [
      '.ts', '.js', '.vue',
    ],
    alias: {
      '@components': helpers.root('src/components/index.ts'),
      '@src': helpers.root('src'),
      '@icons': helpers.root('src/assets/icons'),
      '@images': helpers.root('src/assets/images'),
      '@fonts': helpers.root('src/assets/fonts'),
      '@views': helpers.root('src/components/views/index.ts'),
      '@validators': helpers.root('src/utils/validators.ts'),
      '@methods': helpers.root('src/utils/methods.ts'),
      '@filters': helpers.root('src/utils/filters.ts'),
      '@types': helpers.root('src/typings/index.ts'),
      '@store': helpers.root('src/store/index.ts'),
    }
  },
  module: {
    rules: [{
      test: /\.vue$/,
      use: {
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: ['vue-style-loader', 'css-loader', 'postcss-loader', 'sass-loader', {
              loader: 'sass-resources-loader',
              options: {
                resources: helpers.root('src/styles/variables.scss'),
                esModule: true
              }
            }],
            ts: 'ts-loader',
          }
        }
      }
    }, {
      test: /\.ts$/,
      exclude: /node_modules/,
      loader: 'ts-loader',
      options: {
        appendTsSuffixTo: [/\.vue$/],
      }
    }]
  },
  plugins: [
    new FaviconsWebpackPlugin({
      logo: helpers.root('src/assets/images/logo.png'),
      prefix: 'icons-[hash]/',
      persistentCache: true,
      inject: true,
      background: '#fff',
      icons: {
        android: false,
        appleIcon: false,
        appleStartup: false,
        coast: false,
        favicons: true,
        firefox: false,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false
      }
    }),
    new CopyWebpackPlugin([{
      from: helpers.root('src/assets')
    }])
  ],
};

module.exports = baseConfig;