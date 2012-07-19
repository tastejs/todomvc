(function( app ) {
	'use strict';

	var Entries = Ember.ArrayProxy.extend({
		store: new app.Store( app.storeNamespace ),
		content: [],

		createNew: function( value ) {
			if ( !value.trim() )
				return;
			var todo = this.get( 'store' ).createFromTitle( value );
			this.pushObject( todo );
		},

		pushObject: function( item, ignoreStorage) {
			if ( !ignoreStorage )
				this.get( 'store' ).create( item );
			return this._super( item );
		},

		removeObject: function( item ) {
			this.get( 'store' ).remove( item );
			return this._super( item );
		},

		clearCompleted: function() {
			this.filterProperty(
				'completed', true
			).forEach( this.removeObject, this );
		},

		total: function() {
			return this.get( 'length' );
		}.property( '@each.length' ),

		remaining: function() {
			return this.filterProperty( 'completed', false ).get( 'length' );
		}.property( '@each.completed' ),

		completed: function() {
			return this.filterProperty( 'completed', true ).get( 'length' );
		}.property( '@each.completed' ),

		noneLeft: function() {
			return this.get( 'total' ) === 0;
		}.property( 'total' ),

		allAreDone: function( key, value ) {
			if ( value !== undefined ) {
				this.setEach( 'completed', value );
				return value;
			} else {
				return !!this.get( 'length' ) &&
					this.everyProperty( 'completed', true );
			}
		}.property( '@each.completed' ),

		init: function() {
			this._super();
			// Load items if any upon initialization
			var items = this.get( 'store' ).findAll();
			if ( items.get( 'length' ) ) {
				this.set( '[]', items );
			};
		}
	});

	app.EntriesController = Entries;
	app.entriesController = Entries.create();


})( window.Todos );
