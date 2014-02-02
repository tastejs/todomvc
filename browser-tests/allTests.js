'use strict';

var testSuite = require('./test.js');
var fs = require('fs');
var argv = require('optimist').default('laxMode', false).argv;
var rootUrl = 'http://localhost:8000/';
var frameworkNamePattern = /^[a-z-_]+$/;

// these implementations deviate from the specification to such an extent that they are 
// not worth testing via a generic mecanism
var excludedFrameworks = ['gwt', 'polymer'];

// collect together the framework names from each of the subfolders
var list = fs.readdirSync('../architecture-examples/')
	.map(function (folderName) {
		return { name: folderName, path: 'architecture-examples/' + folderName };
	})
	.concat(fs.readdirSync('../labs/architecture-examples/')
		.map(function (folderName) {
			return { name: folderName, path: 'labs/architecture-examples/' + folderName };
		})
	)
	.concat(fs.readdirSync('../labs/dependency-examples/')
		.map(function (folderName) {
			return { name: folderName, path: 'labs/dependency-examples/' + folderName };
		})
	)
	.concat(fs.readdirSync('../dependency-examples/')
		.map(function (folderName) {
			return { name: folderName, path: 'dependency-examples/' + folderName };
		})
	);

// apps that are not hosted at the root of their folder need to be handled explicitly
var exceptions = [
	{ name: 'chaplin-brunch', path: 'labs/dependency-examples/chaplin-brunch/public' }
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

	if(list.length === 0) {
		console.log('You have either requested an unknown or an un-supported framework');
	}
}

// run the tests for each framework
list.forEach(function (framework) {
	testSuite.todoMVCTest(
		framework.name,
		rootUrl + framework.path + '/index.html', argv.speedMode,
		argv.laxMode
	);
});
