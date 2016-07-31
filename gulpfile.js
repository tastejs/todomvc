'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var pagespeed = require('psi');
var app = require('./server');
var vinylfs = require('vinyl-fs');

var AUTOPREFIXER_BROWSERS = [
	'ie >= 10',
	'ie_mob >= 10',
	'ff >= 30',
	'chrome >= 34',
	'safari >= 7',
	'opera >= 23',
	'ios >= 7',
	'android >= 4.4',
	'bb >= 10'
];

// Lint JavaScript
gulp.task('jshint', function () {
	return gulp.src('site-assets/*.js')
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish'));
});

// Optimize Images
gulp.task('images', function () {
	return gulp.src('site-assets/*.{png,jpg,svg}')
		.pipe($.cache($.imagemin({
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest('dist/site-assets'))
		.pipe($.size({title: 'images'}));
});

// Copy All Files At The Root Level (app)
gulp.task('copy', function () {
	return vinylfs.src([
		'examples/**',
		'bower_components/**',
		'learn.json',
		'CNAME',
		'.nojekyll',
		'site-assets/favicon.ico'
	], {
		dots: true,
		base: './',
		followSymlinks: false,
	})
	.pipe(vinylfs.dest('dist'))
	.pipe($.size({title: 'copy'}));
});

// Compile and Automatically Prefix Stylesheets
gulp.task('styles', function () {
	// For best performance, don't add Sass partials to `gulp.src`
	return gulp.src([
		'site-assets/*.css'
	])
	.pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
	.pipe(gulp.dest('dist/site-assets'))
	.pipe($.size({title: 'styles'}))
	.pipe(gulp.dest('.tmp/site-assets'));
});

// Scan Your HTML For Assets & Optimize Them
gulp.task('html', function () {
	var assets = $.useref.assets({searchPath: '{.tmp,.}'});

	return gulp.src('index.html')
		.pipe(assets)
		.pipe(assets.restore())
		.pipe($.useref())
		// Output Files
		.pipe(gulp.dest('dist'))
		// Running vulcanize over the written output
		// because it requires access to the written
		// CSS and JS.
		.pipe($.vulcanize({ dest: 'dist', strip: true }))
		.pipe($.size({title: 'html'}));
});

// Clean Output Directory
gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

// Build Production Files, the Default Task
gulp.task('default', ['clean'], function (cb) {
	runSequence(['styles', 'copy'], ['jshint', 'html', 'images'], cb);
});

// Run PageSpeed Insights
// Update `url` below to the public URL for your site
gulp.task('pagespeed', pagespeed.bind(null, {
	// By default, we use the PageSpeed Insights
	// free (no API key) tier. You can use a Google
	// Developer API key if you have one. See
	// http://goo.gl/RkN0vE for info key: 'YOUR_API_KEY'
	url: 'https://todomvc.com',
	strategy: 'mobile'
}));

gulp.task('serve', function (cb) {
	app.listen(8080, cb);
});

gulp.task('test-server', function (cb) {
	app.listen(8000, cb);
});
