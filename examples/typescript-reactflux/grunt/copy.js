
// @see https://github.com/gruntjs/grunt-contrib-copy

module.exports =  function (grunt) {
  'use strict';
  return {
    tsx: {
        files: [
            // includes files within path
            {
                expand: true,
                src: ['src/**/*.tsx','src/**/*.ts'],
                dest: ['<%= config.build %>/'],
                filter: 'isFile',
                rename: function(dest, src) {
                    return dest + src.replace('.tsx','.ts');
                }
            }
        ]
    },
    typings: {
        files: [
            // includes files within path
            {
                expand: true,
                src: ['typings/**/*.d.ts'],
                dest: ['<%= config.build %>/'],
                filter: 'isFile',
                rename: function(dest, src) {
                    return dest + src;
                }
            }
        ]
    }
    /*
    // Workaround for bug in grunt-browserify: options.prelude is ignored.
    "browserify-prelude": {
      files: [
        {
          src: ['<%= config.cwd %>/node_modules/grunt-browserify/node_modules/browserify/node_modules/browser-pack/prelude.js'],
          dest: ['<%= config.cwd %>/node_modules/grunt-browserify/node_modules/browserify/node_modules/browser-pack/_prelude.js']
        }
      ]
    }
    */
  };
};
// React.jsx(`([^`\]*(\.[^`\]*)*)`)
