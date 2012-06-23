define('app/controllers/todos', [ 'ember' ],
	/**
	 * Todos controller
	 *
	 * @returns Class
	 */
	function() {
		return Ember.Controller.extend({

			// Handle visibility of some elements as items totals change
			visibilityObserver: function() {
				$( '#main, #footer' ).toggle( !!this.getPath( 'content.total' ) );
			}.observes( 'content.total' ),

		});
	}
);
