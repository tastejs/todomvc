(function( curl ) {

	var config = {
		baseUrl: 'js',
		paths: {
			curl: 'lib/curl/src/curl'
		},
		pluginPath: 'curl/plugin',
		packages: [
			{ name: 'wire', location: 'lib/wire', main: 'wire' },
			{ name: 'when', location: 'lib/when', main: 'when' },
			{ name: 'aop', location: 'lib/aop', main: 'aop' },
			{ name: 'cola', location: 'lib/cola' }
		]
	};

	curl(config, ['wire!main']);

})( curl );