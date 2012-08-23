(function( curl ) {

	var config = {
		baseUrl: 'app',
		paths: {
			theme: '../theme',
			curl: '../lib/curl/src/curl'
		},
		pluginPath: 'curl/plugin',
		packages: [
			{ name: 'wire', location: '../lib/wire', main: 'wire' },
			{ name: 'when', location: '../lib/when', main: 'when' },
			{ name: 'aop',  location: '../lib/aop',  main: 'aop' },
			{ name: 'cola', location: '../lib/cola', main: 'cola' },
			{ name: 'poly', location: '../lib/poly', main: 'poly' }
		]
	};

	curl(config, ['poly/string', 'poly/array']).next(['wire!main']);

})( curl );
