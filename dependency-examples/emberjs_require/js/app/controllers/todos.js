define('app/controllers/todos', [ 'ember' ],
	/**
	 * Todos controller
	 *
	 * @returns Class
	 */
	function() {
		return Ember.Controller.extend({
			entries: function() {
				var filter = this.getPath( 'content.filterBy' );

				if ( Ember.empty( filter ) ) {
					return this.get( 'content' );
				}

				if ( !Ember.compare( filter, 'completed' ) ) {
					return this.get( 'content' ).filterProperty( 'completed', true );
				}

				if ( !Ember.compare( filter, 'active' ) ) {
					return this.get( 'content' ).filterProperty( 'completed', false );
				}

			}.property( 'content.remaining' )
		});
	}
);
