define('app/models/todo', ['ember'],
	/**
	 * Todo entry model
	 *
	 * @returns Class
	 */
	function() {
		return Ember.Object.extend({
			id: null,
			title: null,
			completed: false,
			// set store reference upon creation instead of creating static bindings
			store: null,
			// Observer that will react on item change and will update the storage
			todoChanged: function() {
				this.get( 'store' ).update( this );
			}.observes( 'title', 'completed' )
		});
	}
);
