// Karma configuration
// Generated on Fri Mar 31 2017 02:40:49 GMT-0400 (EDT)
const webpackEnv = {test:true};
//const webpackConfig = require("./webpack.config")(webpackEnv);
const webpackConfig = require("./webpack.config");
webpackConfig.mode = 'development';
webpackConfig.output.filename='[name].[hash:8].js';
const fileGlob =  './src/tests/index.test.js';
process.env.BABEL_ENV = 'test';
//const rxjs = require("rxjs");


module.exports = function(config) {

  if (process.env.TRAVIS) {
    config.browsers = ['Chrome_travis_ci'];
  }




  webpackConfig.module.rules.push(
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

  );
  console.log("CONFIG KARMA ",webpackConfig);


  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    output:{

    },

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: [
      {pattern: './node_modules/spynejs-polyfill/ie.js', watched:false},
      {pattern: './node_modules/ramda/dist/ramda.min.js', watched:false},

      { pattern: './node_modules/rxjs/*.js', included:false,   watched: false },
      { pattern: './node_modules/rxjs/**/*.js', included:false,    watched: false },



 /*     { pattern: './node_modules/rxjs-compat/!**!/!*.js', included: true, watched: false },
      { pattern: './node_modules/rxjs-compat/!*.js', included: true, watched: false },
*/

      /*
            {pattern: './node_modules/rxjs-compat/Rx.js', included: false, watched:false},
      */

/*
      {pattern: './src/tests/mocks/spyne-docs.mocks.js',type:'dom'},
*/


      {pattern: './src/tests/*.test.js', watched: true},

      {pattern: './src/tests/channels/*.test.js', watched: true},

      {pattern: './src/tests/utils/*.test.js', watched: true},
      {pattern: './src/tests/views/*.test.js', watched: true}
    ],




    // list of files to exclude
    exclude: [

    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
     './src/tests/*.test.js' : ['webpack', 'coverage'],
      './src/tests/channels/*.test.js' : ['webpack', 'coverage'],
      './src/tests/utils/*.test.js' : ['webpack', 'coverage'],
      './src/tests/views/*.test.js' : ['webpack', 'coverage']
    },

    webpack: webpackConfig,

    webpackMiddleware: {noInfo: true},


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['coverage'],

    /*
        coverageReporter: {
          reporters: [
              {type: 'lcov', dir: 'coverage/', subdir: '.'},
              {type: 'text-summary'}


          ]
        },
    */


    coverageReporter: {
      reporters: [
        // generates ./coverage/lcov.info
        {type:'lcovonly', subdir: '.'},
        // generates ./coverage/coverage-final.json
        {type:'json', subdir: '.'},
      ]
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,



    customLaunchers: {

       ChromeHeadlessNoSandbox: {
       base: 'ChromeHeadless',
       flags: ['--no-sandbox']
     },

      VirtualBoxIE11onWin7: {
        base: 'VirtualBoxIE11',
        keepAlive: true,
        snapshot: 'pristine',
        uuid: '0552dac4-c8f0-4d29-b81a-ae70026505c5'
      }



    },



    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome','VirtualBoxIE11onWin7'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}