const gulp = require('gulp');
const browserify = require('gulp-browserify');
const rename = require('gulp-rename');
module.exports = function() {
    // zuix-bundler.js
    return gulp.src('src/js/bundler.js', {read: false})
        .pipe(browserify({
            standalone: 'zuix-bundler'
        }))
        .pipe(rename('zuix-bundler.js'))
        .pipe(gulp.dest('./dist/js'));
};
