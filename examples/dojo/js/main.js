(function (global) {
	'use strict';

	global.require = {
		async: true,
		baseUrl: '.',
		callback: function (parser) {
			parser.parse();
		},
		deps: ['dojo/parser'],
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
			}
		],
		map: {
			// TodoMVC application does not use template from file system
			'dijit/_TemplatedMixin': {
				'dojo/cache': 'todo/empty'
			}
		},
		parseOnLoad: false
	};
})(this);
