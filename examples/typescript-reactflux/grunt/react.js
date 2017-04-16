
module.exports =  function (grunt) {
    'use strict';
    return {
        jsx: {
            files: [
                {
                    expand: true,
                    src: ['<%= config.build %>/src/**/*.ts'],
                    ext: '.js'
                }
            ]
        }
    };
};
