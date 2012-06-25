(function( app ) {
	'use strict';

	var TodosController = Ember.Controller.extend({
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
		}.property( 'content.remaining', 'content.filterBy' )
	});

	app.TodosController = TodosController;

})( window.Todos );
