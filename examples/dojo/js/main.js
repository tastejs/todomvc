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
				location: './bower_components/dojo'
			},
			{
				name: 'dijit',
				location: './bower_components/dijit'
			},
			{
				name: 'dojox',
				location: './bower_components/dojox'
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
