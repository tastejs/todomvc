const path = require('path');
const webpack = require('webpack');
const PACKAGE = require('./package');
//const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
 const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const env = require('yargs').argv.env; // use --env with webpack 2
const libraryName = 'spyne';
let devToolValue = 'eval-source-map';
let outputFile;
let externalsArr =[];
let viewStreamFile = path.join(__dirname, '/src/spyne/views/view-stream-base.js');
let optimizeFile = path.join(__dirname, '/src/spyne/utils/optimize-class.js');
let channelStreamItemFile = path.join(__dirname, '/src/spyne/channels/channel-payload-class.js');
const WebpackRxjsExternals = require('webpack-rxjs-externals');

const loaderOptionsPlugin = new webpack.LoaderOptionsPlugin({ options: {
    test: /(\.js)$/,
    loader: 'eslint-loader',
    exclude: [/node_modules/,/(src\/tests)/],
    options: {
      fix: true
    }
  }
});

/*
let ubuObj = {
  UBU : JSON.stringify("THE UBU VAL"),
  VERSION: JSON.stringify(PACKAGE.version)
};

const definePlugin = new webpack.DefinePlugin(ubuObj);
console.log("ADRESS: ",ubuObj,PACKAGE);
*/


/*const dotEnv = new Dotenv({
  path: './.env', // Path to .env file (this is the default)
  safe: true // load .env.example (defaults to "false" which does not use dotenv-safe)
});;*/

let spynePlugins = [loaderOptionsPlugin];

if (env === 'build') {
  /*plugins.push( new UglifyJsPlugin({
    sourceMap: true,
    extractComments: true,
    uglifyOptions: {
      warnings: true,
      compress: true,
      extractComments: true,
      output: {
        comments: false,
        beautify: false
      },
      toplevel: false,
      nameCache: null,
      ie8: false,
      keep_classnames: undefined,
      keep_fnames: false,
      safari10: false
    }

  }));*/
 //plugins.push(  new BundleAnalyzerPlugin());
  outputFile = libraryName + '.min.js';
  devToolValue = 'none';
  externalsArr = [
    WebpackRxjsExternals(),
    {ramda : {
        commonjs: 'ramda',
        commonjs2: 'ramda',
        amd: 'ramda',
        root: 'R'
      }}
  ];
} else {
  outputFile = libraryName + '.js';
}

const config = {
/*
  entry:  ["babel-polyfill",  path.join(__dirname, '/src/spyne/spyne.js')],
*/
  entry: path.join(__dirname, '/src/spyne/spyne.js'),


  devtool: '',
  output: {
    path: path.join(__dirname, '/lib'),
    filename: outputFile,
    library: 'spyne',
    libraryTarget:  'umd',
    // libraryExport: [path.join(__dirname, '/src/spyne/spyne.js'),channelStreamItemFile], //[ path.join(__dirname, '/src/spyne/spyne.js')],
    umdNamedDefine: true
  },


  externals: externalsArr,

  module: {
    rules: [
      {
        test: /(\.js)$/,
        loader: 'babel-loader',
        options: {
          "babelrc" : false,
          "presets": [
            ["@babel/preset-env", {
              "targets": {
                "ie" : 10,
                  "browsers": ["last 2 versions"]

              },
              "modules": false,
              "loose": true
            }]
          ]
        },
        exclude: /(node_modules)/
      }
      /*,
      {
        test: /(\.js)$/,
        loader: 'eslint-loader',
        exclude: [/node_modules/,/(src\/tests)/],
        options: {
          fix: true
        }
      }*/
    ]
  },
  resolve: {
    modules: [path.resolve('./node_modules')],
    extensions: ['.json', '.js']
  },
  plugins: spynePlugins
};

module.exports = config;
// ports = base;
