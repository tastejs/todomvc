
// Make sure TypeScript code is up to par

module.exports =  function (grunt) {
    'use strict';
    return {

        options: {
            configuration: grunt.file.readJSON('.tslintrc')
        },
        all: {
            src: [
                '<%= config.build %>/src/**/*.ts'
            ]
        }
    };
};
