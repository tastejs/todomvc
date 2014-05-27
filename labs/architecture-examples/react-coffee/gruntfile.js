var webpack = require("webpack");

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // pkg: grunt.file.readJSON('package.json'),
    copy: {
      main: {
        expand:'true',
        cwd: 'src/',
        src: '*.html',
        dest: 'out/',
        filer:'isFile'
      }
    },
    bower: {
      install: {
        options: {
          targetDir: './out/lib',
          layout: 'byType',
          install: true,
          verbose: false,
          cleanTargetDir: false,
          cleanBowerDir: true,
          bowerOptions: {}
        }
      }
    },
    'http-server': {
       main:{

            // the server root directory
            root: 'out',

            port: 8000,
            // port: function() { return 8282; }

            host: "localhost",

            cache: '-1',
            showDir : true,
            autoIndex: true,
            defaultExt: "html",

            // run in parallel with other tasks
            runInBackground: false

        }

    },
    clean: {
      main: ["out"]
    },
    webpack: {
      dev: {
        // webpack options
        entry: "./src/app.coffee",
        output: {
          filename: "out/bundle.js",
        },
        resolve: {
          modulesDirectories:["node_modules"]
        },
        stats: {
          // Configure the console output
          colors: true,
          modules: true,
          reasons: true
        },
        failOnError: true, 
        module: {
          loaders: [
            { test: /\.coffee$/, loader: "coffee-loader" },
            { test: /\.(coffee\.md|litcoffee)$/, loader: "coffee-loader?literate" }
          ]
        },
        devtool:'inline-source-map'
      },
      main: {
        // webpack options
        entry: "./src/app.coffee",
        output: {
          filename: "out/bundle.js",
        },
        resolve: {
          modulesDirectories:["node_modules"]
        },
        stats: {
          // Configure the console output
          colors: true,
          modules: true,
          reasons: true
        },
        failOnError: true, 
        module: {
          loaders: [
            { test: /\.coffee$/, loader: "coffee-loader" },
            { test: /\.(coffee\.md|litcoffee)$/, loader: "coffee-loader?literate" }
          ]
        },
        // devtool:'inline-source-map',
        plugins: [
          new webpack.optimize.DedupePlugin(),
          new webpack.optimize.AggressiveMergingPlugin(),
          new webpack.optimize.UglifyJsPlugin()
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-http-server');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task(s).
  grunt.registerTask('build-prod', ['bower:install','webpack:main','copy']);
  grunt.registerTask('build-dev', ['bower:install','webpack:dev','copy']);
  grunt.registerTask('serve', ['http-server']);
  grunt.registerTask('prod', ['build-prod','serve']);
  grunt.registerTask('dev', ['build-dev','serve']);
  grunt.registerTask('default', ['prod']);
};