'use strict';

var testSuite = require('./test.js');
var fs = require('fs');
var argv = require('optimist').default('laxMode', false).default('browser', 'chrome').argv;
var rootUrl = 'http://localhost:8000/';
var frameworkNamePattern = /^[a-z-_]+$/;

var excludedFrameworks = [
	// this implementation deviates from the specification to such an extent that they are
	// not worth testing via a generic mechanism
	'gwt',
	// selenium webdriver cannot see the shadow dom
	'polymer',
	// these implementations cannot be run offline, because they are hosted
	'derby', 'firebase-angular', 'meteor', 'socketstream',
	// YUI is a special case here, it is not hosted, but fetches JS files dynamically
	'yui',
	// these frameworks take a long time to start-up, and there is no easy way to determine when they are ready
	'cujo', 'montage',
	// sammyjs fails intermittently, it would appear that its state is sometimes updated asynchronously?
	'sammyjs',
	// elm-html batches UI updates with requestAnimationFrame which the tests
	// don't wait for
	'elm',
	// these are examples that have been removed or are empty folders
	'emberjs_require', 'dermis'
];

// collect together the framework names from each of the subfolders
var list = fs.readdirSync('../examples/')
	.map(function (folderName) {
		return { name: folderName, path: 'examples/' + folderName };
	});

// apps that are not hosted at the root of their folder need to be handled explicitly
var exceptions = [
	{ name: 'chaplin-brunch', path: 'examples/chaplin-brunch/public' },
	{ name: 'angular-dart', path: 'examples/angular-dart/web' },
	{ name: 'duel', path: 'examples/duel/www' },
	{ name: 'dart', path: 'examples/vanilladart/build/' },
	{ name: 'canjs_require', path: 'examples/canjs_require/' },
	{ name: 'troopjs', path: 'examples/troopjs_require/' },
	{ name: 'thorax_lumbar', path: 'examples/thorax_lumbar/public' },
];
list = list.map(function (framework) {
	var exception = exceptions.filter(function (exFramework) {
		return exFramework.name === framework.name;
	});
	return exception.length > 0 ? exception[0] : framework;
});

// filter out any folders that are not frameworks (.e.g  hidden files)
list = list.filter(function (framework) {
	return frameworkNamePattern.test(framework.name);
});

// filter out un-supported implementations
list = list.filter(function (framework) {
	return excludedFrameworks.indexOf(framework.name) === -1;
});

// if a specific framework has been named, just run this one
if (argv.framework) {
	list = list.filter(function (framework) {
		return framework.name === argv.framework;
	});

	if (list.length === 0) {
		console.log('You have either requested an unknown or an un-supported framework');
	}
}

// run the tests for each framework
list.forEach(function (framework) {
	testSuite.todoMVCTest(
		framework.name,
		rootUrl + framework.path + '/index.html', argv.speedMode,
		argv.laxMode, argv.browser);
});
