// To run the test cases:
//     With node.js:
//         > cd /path/to/todomvc/examples/dojo/
//         > node node_modules/intern/bin/intern-client.js config=test/intern
//     With node.js and WebDriver:
//         > cd /path/to/todomvc/examples/dojo/
//         > npm test
//     With browser:
//         > cd /path/to/todomvc
//         > gulp serve
//         Then hit: http://localhost:8080/examples/dojo/node_modules/intern/client.html?config=test/intern
define((function (global) {
	'use strict';

	// dojoConfig needs to be defined here, otherwise it's too late to affect the dojo loader api
	global.dojoConfig = {
		async: true
	};

	return {
		loader: {
			baseUrl: typeof window !== 'undefined' ? '../..' : '.',
			packages: [
				{
					name: 'dojo',
					location: './node_modules/dojo'
				},
				{
					name: 'dijit',
					location: './node_modules/dijit'
				},
				{
					name: 'dojox',
					location: './node_modules/dojox'
				},
				{
					name: 'todo',
					location: './js/todo'
				},
				{
					name: 'test',
					location: './test'
				}
			],
			map: {
				'todo/widgets/Todos': {
					'dojo/router': 'test/RouterMock'
				},
				'test/todo/widgets/Todos': {
					'dojo/router': 'test/RouterMock'
				}
			}
		},

		useLoader: {
			'host-node': 'dojo/dojo',
			'host-browser': '../../node_modules/dojo/dojo.js'
		},

		proxyPort: 9000,

		proxyUrl: 'http://localhost:9000/',

		capabilities: {
			'selenium-version': '2.44.0',
			'idle-timeout': 60
		},

		environments: [
			{browserName: 'internet explorer'},
			{browserName: 'firefox'},
			{browserName: 'chrome'},
			{browserName: 'safari'}
		],

		maxConcurrency: 3,

		useSauceConnect: false,

		webdriver: {
			host: 'localhost',
			port: 4444
		},

		suites: ['test/all'],

		excludeInstrumentation: /^(node_modules|test)/
	};
})(this));
