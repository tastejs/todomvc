// Dojo build profile for TodoMVC.
// Usage:
//		> cd /path/to/todomvc/examples/dojo
//		> npm install
//		> ./node_modules/dojo-util/buildscripts/build.sh --profile ./profiles/todomvc.profile.js --release

/*jshint unused:false*/
var profile = {
	// relative to this file
	basePath: '../js',

	// relative to base path
	releaseDir: './lib',

	stripConsole: 'normal',

	optimize: 'shrinksafe',
	layerOptimize: 'shrinksafe',

	packages: [
		{
			name: 'dojo',
			location: '../node_modules/dojo'
		},
		{
			name: 'dijit',
			location: '../node_modules/dijit'
		},
		{
			name: 'dojox',
			location: '../node_modules/dojox'
		}
	],

	layers: {
		'dojo/dojo': {
			include: [
				// dojo, dijit and dojox modules from js/todo/*.js
				'dojo/_base/declare',
				'dojo/_base/array',
				'dojo/_base/lang',
				'dojo/router',
				'dojo/when',
				'dojo/Stateful',
				'dojo/has',
				'dojo/json',
				'dojo/store/util/QueryResults',
				'dojo/store/util/SimpleQueryEngine',
				'dijit/_WidgetBase',
				'dijit/_TemplatedMixin',
				'dijit/_WidgetsInTemplateMixin',
				'dijit/_FocusMixin',
				'dojox/mvc/_InlineTemplateMixin',
				'dojox/mvc/at',
				'dojox/mvc/getStateful',
				'dojox/mvc/StatefulArray',
				'dojox/mvc/StoreRefController',
				'dojox/mvc/Element',
				'dojox/mvc/WidgetList'
			],
			boot: true,
			customBase: true
		}
	},

	staticHasFeatures: {
		'dojo-sync-loader': false
	},

	selectorEngine: 'lite',

	defaultConfig: {
		hasCache: {
			'config-selectorEngine': 'lite'
		},
		async: true
	}
};
