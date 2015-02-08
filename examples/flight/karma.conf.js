// Karma configuration file
//
// For all available config options and default values, see:
// https://github.com/karma-runner/karma/blob/stable/lib/config.js#L54

module.exports = function (config) {
	'use strict';

	config.set({
		// base path, that will be used to resolve files and exclude
		basePath: '',

		frameworks: ['jasmine'],

		// list of files / patterns to load in the browser
		files: [
			// loaded without require
			'node_modules/es5-shim/es5-shim.js',
			'node_modules/es5-shim/es5-sham.js',

			'node_modules/jquery/dist/jquery.js',
			'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
			'node_modules/jasmine-flight/lib/jasmine-flight.js',

			// hack to load RequireJS after the shim libs
			'node_modules/requirejs/require.js',
			'node_modules/karma-requirejs/lib/adapter.js',

			// loaded with require
			{ pattern: 'node_modules/flight/lib/*.js', included: false },
			{ pattern: 'node_modules/flight/index.js', included: false },
			{ pattern: 'node_modules/depot/depot.js', included: false },
			{ pattern: 'node_modules/requirejs-text/text.js', included: false },
			{ pattern: 'app/**/*.js', included: false },
			{ pattern: 'app/**/*.html', included: false },
			{ pattern: 'test/spec/**/*_spec.js', included: false },
			{ pattern: 'test/fixture/*.html', included: false },

			// Entry point for karma.
			'test/test-main.js',

			{ pattern: 'test/mock/*.js', included: true }
		],

		// list of files to exclude
		exclude: [],

		// use dots reporter, as travis terminal does not support escaping sequences
		// possible values: 'dots', 'progress'
		// CLI --reporters progress
		reporters: ['dots'],

		// enable / disable watching file and executing tests whenever any file changes
		// CLI --auto-watch --no-auto-watch
		autoWatch: true,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		// CLI --browsers Chrome, Firefox, Safari
		browsers: ['Chrome', 'Firefox'],

		// If browser does not capture in given timeout [ms], kill it
		// CLI --capture-timeout 5000
		captureTimeout: 20000,

		// Auto run tests on start (when browsers are captured) and exit
		// CLI --single-run --no-single-run
		singleRun: false,

		plugins: [
			'karma-jasmine',
			'karma-requirejs',
			'karma-chrome-launcher',
			'karma-firefox-launcher',
			'karma-ie-launcher',
			'karma-phantomjs-launcher',
			'karma-safari-launcher'
		]
	});
};
