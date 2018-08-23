const gulp = require('gulp');
const browserify = require('gulp-browserify');
const rename = require('gulp-rename');
const header = require('gulp-header');
module.exports = function() {
    // zuix.js
    return gulp.src('src/js/main.js', {read: false})
        .pipe(browserify({
            standalone: 'zuix'
        })/*.on('error', (err) => {
            gutil.log('Browserify Error', gutil.colors.red(err.message));
        })*/)
        // this is necessary for types recognition
        .pipe(header('/** @typedef {Zuix} window.zuix */'))
        .pipe(rename('zuix.js'))
        .pipe(gulp.dest('./dist/js'));
};
