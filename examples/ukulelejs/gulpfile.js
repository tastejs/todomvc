var gulp = require('gulp');
var connect = require('gulp-connect');

gulp.task('connect',function(){
    connect.server({
        livereload: true
    });
});

gulp.task('watch',function(){
    gulp.watch(['*.html','js/**/*.js','css/**/*.css'],['refresh']);
});

gulp.task('refresh',function(){
    console.log("do refresh");
    gulp.src('pages/*.html')
        .pipe(connect.reload());
});

gulp.task('default',['connect','watch']);