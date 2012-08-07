// Define libraries
require.config({
	baseUrl: 'js/',
	paths: {
		jquery: '../../../assets/jquery.min',
		ember: 'lib/ember-latest.min',
		handlebars: '../../../assets/handlebars.min',
		text: 'lib/require/text',
		jasmine: '../../../assets/jasmine/jasmine',
		jasmine_html: '../../../assets/jasmine/jasmine-html'
	}
});

// Load our app
define( 'app', [
	'app/router',
	'app/models/store',
	'app/controllers/entries',
	'app/views/application',
	'jquery',
	'handlebars',
	'ember'
	], function( Router, Store, EntriesController, ApplicationView ) {
		var App = Ember.Application.create({
			VERSION: '1.0',
			rootElement: '#todoapp',
			// Load routes
			Router: Router,
			// Extend to inherit outlet support
			ApplicationController: Ember.Controller.extend(),
			ApplicationView: ApplicationView,
			entriesController: EntriesController.create({
				store: new Store('todos-emberjs')
			}),
			ready: function() {
				this.initialize();
			}
		});

		// Expose the application globally
		return window.Todos = App;
	}
);
