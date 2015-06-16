var require = require || null;

var gulp = require('gulp');
var del = require('del');
var ts = require('gulp-typescript');
var filter = require('gulp-filter');
var log = require('gulp-print');
var replace = require('gulp-replace');
var reactTools = require('react-tools');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var tsd = require('gulp-tsd');
var closureCompiler = require('gulp-closure-compiler');
var runSequence = require('run-sequence');
var tslint = require('gulp-tslint');
var gutil = require('gulp-util');

var config = {
  build: 'build',
  web: 'web',
  js_generated: 'build/js',
  ts_typings: './typings/**',
  ts_sources: './src/**/*.ts',
  ts_jsx: 'build/src/**/*.ts'
};

gulp.task('clean', function(callback) {
  del(config.build, callback);
});

gulp.task('tsd', function (callback) {
  return tsd({
	command: 'reinstall',
	config: './typings/tsd.json'
    }, callback);
});

gulp.task('typings', function() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return gulp.src(config.ts_typings, {base: '.'})
	     .pipe(gulp.dest( config.build ));
});

gulp.task('src', function() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return gulp.src(config.ts_sources, {base: '.'})
	     .pipe(gulp.dest( config.build ));
});

gulp.task('jsx', function() {

  function jsx(all, match)
  {
    var reactCode;

    if( match )
    {
      try {
	       reactCode = reactTools.transform(match, { harmony: false });
      }
      catch (ex) {
	       gutil.error('Problem transforming the following:\n' + match + '\n\n' + ex);
      }
    }

    // In case you need to debug this:
    // gutil.log('jsx =>' + match);

    return '(' + reactCode + ')';
  }

  return gulp.src([config.ts_sources,'!src/react/ReactJSX.ts'])
	    .pipe(replace(/ReactJSX.*`([^`\\]*(\\.[^`\\]*)*)`([^`\\\)]*(\\.[^`\\\)]*)*)\)/gm, jsx))
	    .pipe(replace(/import ReactJSX.*$/gm, ''))
	    // .pipe(log())
	    .pipe(gulp.dest(config.build + '/src/'));
});

gulp.task('ts', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down

  var ts_options = {			      // Use to override the default options, http://gruntjs.com/configuring-tasks#options
      target: 'es5',			      // 'es3' (default) | 'es5'
      sourceMap: false,			      // true (default) | false
      declaration: false,		      // true | false (default)
      removeComments: false,		      // true (default) | false
      noImplicitAny: true,		      // Warn on expressions and declarations with an implied 'any' type.
      module: 'commonjs',
      outDir: config.js_generated,
      fast: 'never',
      typescript: require('typescript')
  };

  return gulp.src( config.ts_jsx)
	.pipe(ts(ts_options))
	.pipe(log())
	.pipe(gulp.dest( config.build + '/js/'));
});

gulp.task('bundle', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down

  // 'function ieKeyFix(key)' => 'var ieKeyFix = function(key)'
  // node_modules/store/store.js declares a function 'ieKeyFix' in the middle of another function and triggers:
  // ERROR - functions can only be declared at top level or immediately within another function in ES5 strict mode

  // 'this.module !== module' => 'window.module !== module' 
  // node_modules/store/store.js has some questionable code that triggered:
  // Uncaught TypeError: Cannot read property 'module' of undefined
  
  return gulp.src( config.build + '/js/app.jsx.js')
	.pipe(browserify({
	  insertGlobals : true,
	  debug: true
	}))
  .pipe(replace(/function ieKeyFix\(key\)/gm, 'var ieKeyFix = function(key)'))
  .pipe(replace(/this.module !== module/gm, 'window.module !== module'))
	.pipe(concat('bundle.js'))
	.pipe(log())
	.pipe(gulp.dest( config.web + '/js/'));
});

gulp.task('minify', function() {

  var options = {
      // [REQUIRED] Path to closure compiler
      compilerPath: './node_modules/closure-compiler/lib/vendor/compiler.jar',
      fileName: 'bundle.min.js',

      // [OPTIONAL] set to true if you want to check if files were modified
      // before starting compilation (can save some time in large sourcebases)
      checkModified: true,

      // [OPTIONAL] Set Closure Compiler Directives here
      compilerFlags: {
	// closure_entry_point: 'App.main',
	compilation_level: 'ADVANCED_OPTIMIZATIONS',
	define: [
	  // 'goog.DEBUG=false'
	],
	externs: [
	  'externs/browserify.js',
	  'externs/react.js',
	  'externs/todomvc.js'
	],
	jscomp_off: [
	  'checkTypes',
	  'fileoverviewTags'
	],
	extra_annotation_name: 'jsx',
	// summary_detail_level: 3,
	language_in: 'ECMASCRIPT5_STRICT',
	// only_closure_dependencies: true,
	// .call is super important, otherwise Closure Library will not work in strict mode.
	output_wrapper: '(function(){%output%}).call(window);',
	warning_level: 'QUIET'
      },
      // [OPTIONAL] Set exec method options
      execOpts: {
	  /**
	   * Set maxBuffer if you got message 'Error: maxBuffer exceeded.'
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
  };

  return gulp.src(config.web + '/js/bundle.js')
	    .pipe(closureCompiler(options))
	    .pipe(log())
	    .pipe(gulp.dest(config.web + '/js/'));
});

gulp.task('tslint', function(){

  var options = {
    configuration: {
      'rules': {
	'ban': [true,
	    ['_', 'extend'],
	    ['_', 'isNull'],
	    ['_', 'isDefined']
	],
	'class-name': true,
	'comment-format': [false,
	    'check-space',
	    'check-lowercase'
	],
	'curly': true,
	'eofline': true,
	'forin': true,
	'indent': [true, 4],
	'interface-name': false,
	'jsdoc-format': false,
	'label-position': true,
	'label-undefined': true,
	'max-line-length': [true, 140],
	'member-ordering': [false,
	    'public-before-private',
	    'static-before-instance',
	    'variables-before-functions'
	],
	'no-arg': true,
	'no-bitwise': false,
	'no-console': [true,
	    'debug',
	    'info-false',
	    'time',
	    'timeEnd',
	    'trace'
	],
	'no-construct': true,
	'no-constructor-vars': true,
	'no-debugger': true,
	'no-duplicate-key': true,
	'no-duplicate-variable': true,
	'no-empty': false,
	'no-eval': true,
	'no-string-literal': true,
	'no-switch-case-fall-through': true,
	'no-trailing-comma': true,
	'no-trailing-whitespace': false,
	'no-unused-expression': false,
	'no-unused-variable': true,
	'no-unreachable': true,
	'no-use-before-declare': true,
	'no-var-requires': false,
	'one-line': [false,
	    'check-open-brace',
	    'check-catch',
	    'check-else',
	    'check-whitespace'
	],
	'quotemark': [false, 'double'],
	'radix': true,
	'semicolon': true,
	'triple-equals': [false, 'allow-null-check'],
	'typedef': [true,
	    'callSignature',
	    'indexSignature',
	    'parameter',
	    'propertySignature',
	    'variableDeclarator'
	],
	'typedef-whitespace': [true,
	    ['callSignature', 'noSpace'],
	    ['catchClause', 'noSpace'],
	    ['indexSignature', 'space']
	],
	'use-strict': [false,
	    'check-module',
	    'check-function'
	],
	'variable-name': false,
	'whitespace': [false,
	    'check-branch',
	    'check-decl',
	    'check-operator',
	    'check-separator',
	    'check-type'
	]
      }
    }
  };

  return gulp.src(config.build + '/src/**/*.ts')
    .pipe(tslint(options))
    .pipe(tslint.report('prose'));
});

/**
  The 'debug' task does not include:
  jsx, tslint
 */
gulp.task('debug', function(callback) {
  return runSequence(
	  'clean',
	  ['typings','src'],
	  'ts',
	  'bundle',
	  callback);
});


gulp.task('release', function(callback) {
  return runSequence(
	  'clean',
	  'tsd',
	  ['typings','jsx'],
	  'tslint',
	  'ts',
	  'bundle',
	  'minify',
	  callback);
});

gulp.task('lint', function(callback) {
  return runSequence(
	  'clean',
	  'tsd',
	  ['typings','jsx'],
	  'tslint',
	  callback);
});

gulp.task('help', function(callback) {
  gutil.log('');
  gutil.log('USAGE:');
  gutil.log('Open web/index.html in browser.');
  gutil.log('');
  gutil.log('TASKS:');
  gutil.log('debug   - builds web/js/bundle.js with runtime JSX renderer.');
  gutil.log('release - builds web/js/bundle.min.js with expanded JSX.');
  gutil.log('');
});

gulp.task('build', ['release']);

gulp.task('default', ['release']);
