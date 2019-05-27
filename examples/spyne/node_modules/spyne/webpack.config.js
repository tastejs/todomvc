const path = require('path');
const webpack = require('webpack');
const PACKAGE = require('./package');
const version = PACKAGE.version;
const env = require('yargs').argv.env; // use --env with webpack 2
const libraryName = 'spyne';
let moduleRulesArr = [];
let devToolValue = 'eval-source-map';
let outputFile;
let externalsArr =[];
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

let bannerPlugin = new webpack.BannerPlugin({
    banner: `spynejs ${version}\nhttps://sypnejs.org\n(c) 2017-present Frank Batista`
})

let spynePlugins = [bannerPlugin,loaderOptionsPlugin];

if (env === 'build') {
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
  moduleRulesArr.push(
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

  )
}

console.log("CONFIG IS ",process.env.BABEL_ENV );


const config = {
  entry: path.join(__dirname, '/src/spyne/spyne.js'),
  devtool: '',
  output: {
    path: path.join(__dirname, '/lib'),
    filename: outputFile,
    library: 'spyne',
    libraryTarget:  'umd',
    umdNamedDefine: true
  },


  externals: externalsArr,

  module: {
    rules: moduleRulesArr
  },
  resolve: {
    modules: [path.resolve('./node_modules')],
    extensions: ['.json', '.js']
  },
  plugins: spynePlugins
};

module.exports = config;
