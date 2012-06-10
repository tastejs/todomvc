// Define libraries
require.config({
	baseUrl: 'js/',
	paths: {
		jquery: '../../../assets/jquery.min',
		ember: 'lib/ember-0.9.7.1.min',
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

			// Sets up mocha to run some integration tests
			specsRunner: function( chai ) {
				// Create placeholder for mocha output
				// TODO: Make this shit look better and inside body
				$( document.body ).before( '<div id="mocha"></div>' );

				// Setup mocha and expose chai matchers
				window.expect = chai.expect;
				mocha.setup('bdd');

				// Load testsuite
				require([
					'app/specs/models/store',
					'app/specs/views/basic_acceptance',
					'app/specs/controllers/todos'
				], function() {
						mocha.run().globals( [ '$', 'Ember', 'Todos' ] );
					}
				);
			},

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
					require( [ 'chai', 'mocha' ], this.specsRunner );
				}
			}
		});

		// Expose the application globally
		return window.Todos = App;
	}
);
