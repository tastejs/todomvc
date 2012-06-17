// Define libraries
require.config({
  baseUrl: 'js/',
  paths: {
    jquery: '../../../../assets/jquery.min',
    ember: 'lib/ember-0.9.8.1.min',
    text: 'lib/text',
    mocha: 'lib/mocha',
    chai: 'lib/chai',
    persistence: 'lib/persistence.min',
    persistence_mem: 'lib/persistence.store.memory.min',
    persistence_sql: 'lib/persistence.store.sql.min',
    persistence_websql: 'lib/persistence.store.websql.min'
  }
});

// Load our app
define('app', [
  'jquery',
  'app/models/store',
  'app/controllers/todos',
  'ember',
  'persistence',
  'persistence_mem',
  'persistence_sql',
  'persistence_websql'
  ], function( $, Store, TodosController ) {
    var App = Ember.Application.create({

      VERSION: '1.0',

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
