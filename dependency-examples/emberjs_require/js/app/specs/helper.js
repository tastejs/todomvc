define( 'app/specs/helper', [ 'chai', 'mocha' ],
	/**
	 * Specs Runner
	 */
	function( chai ) {
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
		});
	}
);
