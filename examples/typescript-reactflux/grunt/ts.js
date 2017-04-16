// typescript compiler
module.exports =  function (grunt) {
    'use strict';
    return {
        app: {
            files: [{ src: ['<%= config.build %>/src/**/*.ts'], dest: '<%= config.build %>/js/' }],
            // src: ['<%= config.build %>/src/**/*.ts'],               // The source TypeScript files, http://gruntjs.com/configuring-tasks#files
            // reference: 'src/scripts/_reference.ts',   // If specified, generate this file that to can use for reference management
            // out: '<%= config.build %>/jsx',                     // If specified, the generate JavaScript files are placed here. Only works if out is not specified
            options: {                                  // Use to override the default options, http://gruntjs.com/configuring-tasks#options
                target: 'es5',                          // 'es3' (default) | 'es5'
                sourceMap: false,                       // true (default) | false
                declaration: false,                     // true | false (default)
                removeComments: false,                  // true (default) | false
                noImplicitAny: true,                    // Warn on expressions and declarations with an implied 'any' type.
                module: 'commonjs',
                outDir: '<%= config.build %>/js/',
                fast: 'never'
            }
        }
   };
};
