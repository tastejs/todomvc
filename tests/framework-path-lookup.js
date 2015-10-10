var fs = require('fs');
var frameworkNamePattern = /^[a-z-_\d]+$/;

var excludedFrameworks = [
	// this implementation deviates from the specification to such an extent that they are
	// not worth testing via a generic mechanism
	'gwt',
	// these implementations cannot be run offline, because they are hosted
	'firebase-angular', 'meteor', 'socketstream',
	// YUI is a special case here, it is not hosted, but fetches JS files dynamically
	'yui',
	// these frameworks take a long time to start-up, and there is no easy way to determine when they are ready
	'cujo',
	// sammyjs fails intermittently, it would appear that its state is sometimes updated asynchronously?
	'sammyjs',
	// elm-html batches UI updates with requestAnimationFrame which the tests
	// don't wait for
	'elm',
	// these are examples that have been removed or are empty folders
	'emberjs_require', 'dermis'
];

module.exports = function (names) {
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
		{ name: 'vanilladart', path: 'examples/vanilladart/build/web' },
		{ name: 'canjs_require', path: 'examples/canjs_require/' },
		{ name: 'troopjs', path: 'examples/troopjs_require/' },
		{ name: 'thorax_lumbar', path: 'examples/thorax_lumbar/public' }
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

	return list.filter(function (framework) {
		return [].concat(names).some(function (f) {
			return f === framework.name;
		});
	});
};
