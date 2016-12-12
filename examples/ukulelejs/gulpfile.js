var gulp = require('gulp');
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');

gulp.task('connect',function(){
    connect.server({
        livereload: true
    });
});

gulp.task('watch',function(){
    gulp.watch(['*.html','js/**/*.js','css/**/*.css'],['refresh']);
});

gulp.task('lint',function(){
    return gulp.src('js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('refresh',function(){
    console.log("do refresh");
    gulp.src('pages/*.html')
        .pipe(connect.reload());
});

gulp.task('default',['lint','connect','watch']);