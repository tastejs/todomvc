define('app/controllers/todos', [
		'app/controllers/entries',
		'app/views/items',
		'app/views/stats',
		'app/views/filters',
		'app/views/clear_button',
	],
	/**
	 * Todos controller
	 *
	 * Main controller inherits the `Entries` class
	 * which is an `ArrayProxy` linked with the `Store` model
	 *
	 * @param Class Entries, the Entries class
	 * @param Class ItemsView, items view class
	 * @param Class StatsView, stats view class
	 * @param Class FiltersView, filters view class
	 * @param Class ClearBtnView, clear button view class
	 * @returns Class
	 */
	function( Entries, ItemsView, StatsView, FiltersView, ClearBtnView ) {
		return Entries.extend({
			// New todo input
			InputView: Ember.TextField.extend({
				placeholder: 'What needs to be done?',
				elementId: 'new-todo',
				// Bind this to newly inserted line
				insertNewline: function() {
					var value = this.get( 'value' );
					if ( value ) {
						this.get( 'controller' ).createNew( value );
						this.set( 'value', '' );
					}
				}
			}),

			// Handle visibility of some elements as items totals change
			visibilityObserver: function() {
				$( '#main, #footer' ).toggle( !!this.get( 'total' ) );
			}.observes( 'total' ),

			// Checkbox to mark all todos done.
			MarkAllChkbox: Ember.Checkbox.extend({
				elementId: 'toggle-all',
				checkedBinding: 'controller.allAreDone'
			}),

			// Activates the views and other initializations
			init: function() {
				this._super();

				this.set( 'inputView', this.InputView.create({ controller: this }) );
				this.set( 'markAllChkbox', this.MarkAllChkbox.create({ controller: this }) );
				this.set( 'itemsView', ItemsView.create({ controller: this }) );
				this.set( 'statsView', StatsView.create({ controller: this }) );
				this.set( 'filtersView', FiltersView.create() );
				this.set( 'clearBtnView', ClearBtnView.create({ controller: this }) );

				this.get( 'inputView' ).appendTo( 'header' );
				this.get( 'markAllChkbox' ).appendTo( '#main' );
				this.get( 'itemsView' ).appendTo( '#main' );
				this.get( 'statsView' ).appendTo( '#footer' );
				this.get( 'filtersView' ).appendTo( '#footer' );
				this.get( 'clearBtnView' ).appendTo( '#footer' );
			}
		});
	}
);
