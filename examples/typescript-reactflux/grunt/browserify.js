// @see https://github.com/jmreidy/grunt-browserify

module.exports =  function (grunt) {
  'use strict';
  return {
    dist: {
      files: {
          '<%= config.public %>/js/bundle.js': ['<%= config.build %>/js/*.js']
      },

      // Doesn't work at all:
      browserifyOptions: {
        debug: true,
        // again, use the unminified dev prelude for easier debugging
        prelude: grunt.file.read("./node_modules/grunt-browserify/node_modules" +
        "/browserify/node_modules/browser-pack/prelude.js")
      }
    }
  };
};
