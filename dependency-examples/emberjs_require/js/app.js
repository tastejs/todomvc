// Define libraries
require.config({
	baseUrl: 'js/',
	paths: {
		jquery: '../../../assets/jquery.min',
		ember: 'http://cloud.github.com/downloads/emberjs/ember.js/ember-latest.min',
		// ember: 'lib/ember-0.9.8.1.min',
		text: 'lib/require/text',
		mocha: 'lib/mocha',
		chai: 'lib/chai'
	}
});

// Load our app
define( 'app', [
	'app/router',
	'app/models/store',
	'app/controllers/todos',
	'jquery',
	'ember',
	], function( Router, Store, TodosController ) {
		var App = Ember.Application.create({

			VERSION: '0.2',

			init: function() {
				this._super();

				this.set( 'todosController', TodosController.create(
					{ store: new Store( 'todos-emberjs' ) }
				) );
			}
		});

		// Initialize Application to load routes
		App.Router = Router;
		App.initialize();
		// Expose the application globally
		return window.Todos = App;
	}
);
