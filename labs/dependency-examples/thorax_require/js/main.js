// Require.js allows us to configure shortcut alias
require.config({
	// The shim config allows us to configure dependencies for
	// scripts that do not call define() to register a module
	shim: {
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: [
				'underscore',
				'jquery'
			],
			exports: 'Backbone'
		},
		'thorax': {
			deps: [
				'underscore',
				'backbone',
				'jquery',
				'handlebars'
			],
			exports: 'Thorax'
		}
	},
	paths: {
		jquery: 'lib/jquery/jquery.min',
		underscore: '../../../../assets/lodash.min',
		backbone: 'lib/backbone/backbone',
		handlebars: '../../../../assets/handlebars.min',
		thorax: 'lib/thorax',
		text: 'lib/require/text'
	}
});

require([
	'views/app',
	'routers/todomvc'
], function( AppView, TodoMVCRouter ) {
	// Initialize routing and start Backbone.history()
	new TodoMVCRouter();

	// Initialize the application view
	var view = new AppView();
	$('body').append(view.el);

	Backbone.history.start();

});
