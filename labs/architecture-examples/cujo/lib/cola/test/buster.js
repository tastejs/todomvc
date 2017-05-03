exports['shared tests'] = {
	tests: [
		'cola.js',
		'SortedMap.js',
		'Hub.js',
		'adapter/*.js',
		'network/strategy/*.js',
		'transform/*.js',
		'relational/*.js',
		'relational/strategy/*.js',
		'projection/*.js',
		'comparator/*.js',
		'validation/**/*.js',
		'dom/**/*.js'
	]
};

exports['node tests'] = {
	environment: 'node',
	extends: 'shared tests'
};
