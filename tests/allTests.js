'use strict';

var testSuite = require('./test.js');
var argv = require('optimist').default('laxMode', false).default('browser', 'chrome').argv;
var frameworkPathLookup = require('./framework-path-lookup');
var rootUrl = 'http://localhost:8000/';

var list = frameworkPathLookup(argv.framework);

if (list.length === 0) {
	console.log('You have either requested an unknown or an un-supported framework');
}

// run the tests for each framework
list.forEach(function (framework) {
	testSuite.todoMVCTest(
		framework.name,
		rootUrl + framework.path + '/index.html', argv.speedMode,
		argv.laxMode, argv.browser);
});
