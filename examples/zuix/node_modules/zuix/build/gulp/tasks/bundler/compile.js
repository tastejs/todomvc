const gulp = require('gulp');
const compiler = require('gulp-closure-compiler');
module.exports = function() {
    // Compile/Minify zuix-bundler.js
    return gulp.src('dist/js/zuix-bundler.js', {base: 'dist/js/'})
        .pipe(compiler({
            fileName: 'zuix-bundler.min.js', // outputs single file
            compilerFlags: {
                // debug: true, // <-- DO NOT ACTIVATE, causes errors in generated js
                warning_level: 'QUIET',
                compilation_level: 'SIMPLE',
                language_in: 'ECMASCRIPT6_STRICT',
                language_out: 'ES5_STRICT',
                // useTypesForOptimization: true,
                // define: [
                //  "goog.DEBUG=false"
                // ],
                create_source_map: 'dist/js/zuix-bundler.min.js.map',
                source_map_location_mapping: 'dist/js/|./',
                output_wrapper: '%output%\n//# sourceMappingURL=zuix-bundler.min.js.map'
            }
        }))
        .pipe(gulp.dest('dist/js'));
};
