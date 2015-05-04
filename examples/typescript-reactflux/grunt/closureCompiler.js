
module.exports =  function (grunt) {
    'use strict';
    return {
        options: {
            // [REQUIRED] Path to closure compiler
            compilerFile: 'node_modules/closure-compiler/lib/vendor/compiler.jar',

            // [OPTIONAL] set to true if you want to check if files were modified
            // before starting compilation (can save some time in large sourcebases)
            checkModified: true,

            // [OPTIONAL] Set Closure Compiler Directives here
            compilerOpts: {
                /**
                 * Keys will be used as directives for the compiler
                 * values can be strings or arrays.
                 * If no value is required use null
                 *
                 * The directive 'externs' is treated as a special case
                 * allowing a grunt file syntax (<config:...>, *)
                 *
                 * Following are some directive samples...
                 */
                compilation_level: 'ADVANCED_OPTIMIZATIONS',
                // compilation_level: 'SIMPLE_OPTIMIZATIONS',
                externs: ['src/externs/browserify.js','src/externs/react.js'],
                // define: ["'goog.DEBUG=false'"],
                // define: ["'require=undefined'"],
                // warning_level: 'verbose',
                jscomp_off: ['checkTypes', 'fileoverviewTags'],
                summary_detail_level: 3
                // output_wrapper: '"(function(){%output%}).call(this);"'
            },
            // [OPTIONAL] Set exec method options
            execOpts: {
                /**
                 * Set maxBuffer if you got message "Error: maxBuffer exceeded."
                 * Node default: 200*1024
                 */
                maxBuffer: 999999 * 1024
            },
            // [OPTIONAL] Java VM optimization options
            // see https://code.google.com/p/closure-compiler/wiki/FAQ#What_are_the_recommended_Java_VM_command-line_options?
            // Setting one of these to 'true' is strongly recommended,
            // and can reduce compile times by 50-80% depending on compilation size
            // and hardware.
            // On server-class hardware, such as with Github's Travis hook,
            // TieredCompilation should be used; on standard developer hardware,
            // d32 may be better. Set as appropriate for your environment.
            // Default for both is 'false'; do not set both to 'true'.
            d32: false, // will use 'java -client -d32 -jar compiler.jar'
            TieredCompilation: true // will use 'java -server -XX:+TieredCompilation -jar compiler.jar'
        },

        // any name that describes your task
        bundle: {

            /**
             *[OPTIONAL] Here you can add new or override previous option of the Closure Compiler Directives.
             * IMPORTANT! The feature is enabled as a temporary solution to [#738](https://github.com/gruntjs/grunt/issues/738).
             * As soon as issue will be fixed this feature will be removed.
             */
            // TEMPcompilerOpts: {
            // },

            // [OPTIONAL] Target files to compile. Can be a string, an array of strings
            // or grunt file syntax (<config:...>, *)
            src: '<%= config.public %>/js/bundle.js',

            // [OPTIONAL] set an output file
            dest: '<%= config.public %>/js/bundle.min.js'
        }
    };
};
