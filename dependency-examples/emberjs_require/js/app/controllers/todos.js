define('app/controllers/todos', [
		'app/views/stats',
		'app/views/filters',
		'app/views/clear_button'
	],
	/**
	 * Todos controller
	 *
	 * Main controller inherits the `Entries` class
	 * which is an `ArrayProxy` linked with the `Store` model
	 *
	 * @param Class StatsView, stats view class
	 * @param Class FiltersView, filters view class
	 * @param Class ClearBtnView, clear button view class
	 * @returns Class
	 */
	function( StatsView, FiltersView, ClearBtnView ) {
		return Ember.Controller.extend({
			viewsLoaded: false,

			// New todo input
			InputView: Ember.TextField.extend({
				placeholder: 'What needs to be done?',
				elementId: 'new-todo',
				insertNewline: function() {
					var value = this.get( 'value' );
					if ( value ) {
						this.get( 'content' ).createNew( value );
						this.set( 'value', '' );
					}
				}
			}),

			// Handle visibility of some elements as items totals change
			visibilityObserver: function() {
				$( '#main, #footer' ).toggle( !!this.getPath( 'content.total' ) );
			}.observes( 'content.total' ),

			// Checkbox to mark all todos done.
			MarkAllChkbox: Ember.Checkbox.extend({
				elementId: 'toggle-all',
				checkedBinding: 'content.allAreDone'
			}),

			// Activates secondary views when content was set
			initViews: function() {
				var entries = this.get( 'content' );

				if ( this.get( 'viewsLoaded' ) || Ember.none( entries ) )
					return;

				this.set( 'inputView', this.InputView.create({ content: entries }) );
				this.set( 'markAllChkbox', this.MarkAllChkbox.create({ content: entries }) );
				// this.set( 'itemsView', ItemsView.create({ controller: this }) );
				this.set( 'statsView', StatsView.create({ controller: entries }) );
				this.set( 'filtersView', FiltersView.create() );
				this.set( 'clearBtnView', ClearBtnView.create({ controller: entries }) );

				this.get( 'inputView' ).appendTo( 'header' );
				this.get( 'markAllChkbox' ).appendTo( '#main' );
				// this.get( 'itemsView' ).appendTo( '#main' );
				this.get( 'statsView' ).appendTo( '#footer' );
				this.get( 'filtersView' ).appendTo( '#footer' );
				this.get( 'clearBtnView' ).appendTo( '#footer' );
			}.observes( 'content' )
		});
	}
);
