
// Make sure code stylesheets are up to par and there are no obvious mistakes

module.exports =  function (grunt) {
    'use strict';
    return {

        all: [
          'Gruntfile.js'

          // jslint is complaining too much about Typescript's generated code, i.e. enums and __extends
          // '<%= config.build %>/js/**/*.js'

          // jslinting bundle.js is a pain, because browserify adds its dirty minified _prelude.js which gets merged with unsanitized
          // react and flux JS files.

          // '<%= config.public %>/js/bundle.js'
        ],
        options: {
            jshintrc: '.jshintrc'
        }
    };
};
