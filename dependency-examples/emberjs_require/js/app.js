// Define libraries
require.config({
	baseUrl: 'js/',
	paths: {
		jquery: '../../../assets/jquery.min',
                ember: 'lib/ember-0.9.8.1.min',
		text: 'lib/require/text',
		mocha: 'lib/mocha',
		chai: 'lib/chai'
	}
});

// Load our app
define( 'app', [
	'jquery',
	'app/models/store',
	'app/controllers/todos',
	'ember',
	], function( $, Store, TodosController ) {
		var App = Ember.Application.create({

			VERSION: '0.2-omfg',

			// Constructor
			init: function() {
				this._super();

				// Initiate main controller
				this.set(
					'todosController',
					TodosController.create({
						store: new Store( 'todos-emberjs' )
					})
				);

				// Run specs if asked
				if ( location.hash.match( /specs/ ) ) {
					require( [ 'app/specs/helper' ] );
				}
			}
		});

		// Expose the application globally
		return window.Todos = App;
	}
);
