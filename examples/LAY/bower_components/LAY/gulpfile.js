var gulp = require( 'gulp' );
var concat = require( 'gulp-concat' );
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');



var js_fileS = [
	"./src/entry.js",
	"./src/obj/*.js",
	"./src/method/*.js",
	"./src/helper/*.js"
];

gulp.task( "concat", function() {

	gulp.src( js_fileS )
	.pipe( concat( "LAY.js" ) )
	.pipe( gulp.dest( "./" ) );

});

gulp.task( "minify", function () {
	gulp.src("LAY.js").pipe(
		concat("LAY.min.js")
		).pipe( uglify({
			preserveComments: "license"
		})
		).pipe( gulp.dest("./") );
});



gulp.task('default', function() {
    gulp.watch( js_fileS,  [ "concat" ] );
    gulp.watch( "LAY.js", ["minify"]);
    gulp.start( "concat" );

});
